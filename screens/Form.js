import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker';
import Header from '../components/Header';
import EList from '../components/EmployeeDetail';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Forms = (props) => {

    // let { isEdit, index } = props?.route?.params?.
let data = props?.route?.params?.data
let isEdit= props?.route?.params?.isEdit
let index= props?.route?.params?.index

    const [open, setOpen] = useState(false)
    const [dob, setDob] = useState(isEdit ? data.Dob : "Select Date")
    const [month, setMonth] = useState(isEdit ? data.Month : "")
    const [year, setYear] = useState(isEdit ? data.Year : "")
    const [drop, setDrop] = useState(false);
    const [gender, setGender] = useState(isEdit ? data.Gender : null);
    const [items, setItems] = useState([
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
    ]);

    const [fName, setFName] = useState(isEdit ? data.FirstName : "")
    const [lName, setLName] = useState(isEdit ? data.LastName : "")
    const [email, setEmail] = useState(isEdit ? data.Email : "")
    const [pNo, setPNo] = useState(isEdit ? data.PNo : "")
    const [add, setAdd] = useState(isEdit ? data.Address : "")

const getAsync = async () => {
    try{
          const value =   await AsyncStorage.getItem('name');
          console.log(value);
    }
    catch(e){
        console.log("error", e);
    }
}


    const onSave = () => {

        if (fName == "" || lName == "" || dob == "Select Date" || pNo == "" || gender == null || add == "") {
            alert("Don't leave the fields empty")
        }
        else {
            if (email.includes("@") == true && email.includes(".com") == true) {
                const dummy = { FirstName: fName, LastName: lName, Name: fName + " " + lName, Email: email, Month: month, Year: year, Dob: dob, PNo: pNo, Gender: gender, Address: add }
                if (isEdit == false) {
                    EList.push(dummy)
                }
                else {
                    EList.splice(index, 1, dummy)
                }
                props.navigation.navigate('List', { array: EList })
            }
            else {
                alert("Please write proper email!")
            }
        }
    }

    const postAPI = () => {
        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: "POST",
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                title: fName,
                body: email,
                userId: pNo,})
        }).then(res => res.json())
            .then((res) => {
                console.log("res", res)
                props.navigation.navigate('List')
            }).catch((rej) => console.log("REJECTED", rej))
    }

    return (
        <View style={styles.container}>
            <Header title='FORM' showIcon={true} />
            <View style={styles.subContainer}>
                <View style={styles.firstLast}>
                    <View style={styles.name}>
                        <Text style={styles.text}>First Name</Text>
                        <TextInput
                            style={styles.nameInput}
                            value={fName}
                            onChangeText={(txt) => { setFName(txt); }}
                        />
                    </View>
                    <View style={styles.name}>
                        <Text style={styles.text}>Last Name</Text>
                        <TextInput style={styles.nameInput}
                            value={lName}
                            onChangeText={(txt) => { setLName(txt); }}
                        />
                    </View>
                </View>
                <View style={styles.email} >
                    <Text style={styles.text}>Email</Text>
                    <TextInput style={styles.inputField}
                        value={email}
                        keyboardType='email-address'
                        onChangeText={(txt) => { setEmail(txt); }}
                    />
                </View>

                <View style={styles.dob}>
                    <Text style={styles.text}>Date Of Birth</Text>
                    <Text style={styles.viewDob}>{dob}</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => { setOpen(true) }}
                    >
                        <Icon name="calendar"
                            size={20}
                            color="white" />
                    </TouchableOpacity>
                    <DatePicker
                        modal
                        open={open}
                        date={new Date("2004-11-08")}
                        mode={'date'}
                        maximumDate={new Date("2004-11-11")}
                        onConfirm={(date) => {
                            if (EList.findIndex(Item => Item.Month == date.getMonth()) >= 0 && EList.findIndex(Item => Item.Year == date.getFullYear()) >= 0) {
                                alert("Select other date")
                                setOpen(false)
                            }
                            else {
                                setDob(date.getDate() + "-" + (parseInt(date.getMonth()) + 1) + "-" + date.getFullYear())
                                setMonth(date.getMonth())
                                setYear(date.getFullYear())
                                setOpen(false)
                            }
                        }}
                        onCancel={() => {
                            setOpen(false)
                        }}
                    />
                </View>

                <View style={styles.email} >
                    <Text style={styles.text}>Phone No</Text>
                    <TextInput style={styles.inputField}
                        value={pNo}
                        keyboardType='numeric'
                        onChangeText={(txt) => { setPNo(txt); }}
                    />
                </View>
                <View style={styles.genders}>
                    <Text style={styles.text}>Gender</Text>
                    <DropDownPicker
                        style={styles.dropdown}
                        open={drop}
                        value={gender}
                        items={items}
                        setOpen={setDrop}
                        setValue={setGender}
                        setItems={setItems}
                    />
                </View>
                <View style={styles.ad}>
                    <Text style={styles.text}>Address</Text>
                    <TextInput style={styles.multilineInput}
                        multiline={true}
                        value={add}
                        onChangeText={(txt) => { setAdd(txt); }}
                        numberOfLines={3}
                    />
                </View>
            </View>
            <View style={styles.buttonView}>
                <TouchableOpacity style={styles.saveBtn}
                    onPress={() => { onSave() }}
                >
                    <Text style={styles.save}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    subContainer: {
        height: "75%",
        width: "90%",
        backgroundColor: "#2D4874",
        borderRadius: 10,
        padding: 10,
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    firstLast: {
        flexDirection: 'row',
        justifyContent: "space-between",
        height: "12%",
        alignItems: "center",
    },
    email: {
        height: "12%",
    },
    name: {
        width: "48%",
        height: "100%",
        flexDirection: 'column',
        justifyContent: "center",

    },
    nameInput: {
        width: "100%",
        height: "40%",
        borderColor: 'black',
        backgroundColor: 'white',
        borderWidth: 2,
        padding: 0
    },
    inputField: {
        width: "100%",
        height: "40%",
        borderColor: 'black',
        backgroundColor: 'white',
        borderWidth: 2,
        padding: 0
    },
    dob: {
        width: "100%",
        height: "10%",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center"
    },
    viewDob: {
        borderWidth: 0.1,
        backgroundColor: 'white',
    },
    calendar: {
        width: "100%",
        height: "20%",
    },
    button: {
        color: "black",
    },
    multilineInput: {
        height: "50%",
        borderWidth: 2,
        backgroundColor: 'white',
        textAlignVertical: 'top',

    },
    saveBtn: {
        borderWidth: 1,
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        borderColor: "white",
        backgroundColor: "#2D4874",

    },
    text: {
        fontWeight: '800',
        fontSize: 20,
        width: "70%",
        color: 'white',

    },
    dropdown: {
        backgroundColor: "#fff",
        height: "10%",
    },
    genders: {
        height: "20%",
    },
    ad: {
        height: "30%",
    },
    buttonView: {
        height: "9%",
        width: "60%",
        alignItems: 'center',
        justifyContent: 'center'
    },
    save: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white'
    }

})


export default Forms;