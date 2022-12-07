import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Dimensions } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker';
import Header from '../components/Header';
import EList from '../components/EmployeeDetail';
import AsyncStorage from "@react-native-async-storage/async-storage";
import SQLite from 'react-native-sqlite-storage'
// SQLite.DEBUG(true)
// SQLite.enablePromise(true)

const db = SQLite.openDatabase(
    {
        name: "Employees",
        location: 'default'
    },
    () => { },
    error => { console.log(error) }
)
// SQLite.DEBUG(true)s
// SQLite.enablePromise(true)

const Forms = (props) => {

    // let { isEdit, index } = props?.route?.params?.
    let data = props?.route?.params?.data
    let isEdit = props?.route?.params?.isEdit
    let index = props?.route?.params?.index

    const [open, setOpen] = useState(false)
    const [dob, setDob] = useState(isEdit ? data?.Dob : "Select Date")
    const [month, setMonth] = useState(isEdit ? data?.Month : "")
    const [year, setYear] = useState(isEdit ? data?.Year : "")
    const [drop, setDrop] = useState(false);
    const [gender, setGender] = useState(isEdit ? data?.Gender : null);
    const [items, setItems] = useState([
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
    ]);

    const [fName, setFName] = useState(isEdit ? data?.FName : "")
    const [lName, setLName] = useState(isEdit ? data?.LName : "")
    const [email, setEmail] = useState(isEdit ? data?.Email : "")
    const [password, setPassword] = useState(isEdit ? data?.Password : "")
    const [pNo, setPNo] = useState(isEdit ? data?.PNo : "")
    const [add, setAdd] = useState(isEdit ? data?.Address : "")
    const [showPassword, setShowPassword] = useState(true)

    const getAsync = async () => {
        try {
            const value = await AsyncStorage.getItem('name');
            console.log(value);
        }
        catch (e) {
            console.log("error", e);
        }
    }
    console.log(data)

    const onSave = () => {

        if (fName == "" || lName == "" || password == "" || dob == "Select Date" || pNo == "" || gender == null || add == "") {
            alert("Don't leave the fields empty")
        }
        else {
            if (email.includes("@") == true && email.includes(".com") == true) {
                const dummy = { FirstName: fName, LastName: lName, Name: fName + " " + lName, Email: email, Password: password, Month: month, Year: year, Dob: dob, PNo: pNo, Gender: gender, Address: add }
                if (isEdit == false) {
                    EList.push(dummy)
                    settingData()
                }
                else {
                    updateDB()
                }
                props.navigation.navigate('List', { array: EList })
            }
            else {
                alert("Please write proper email!")
            }
        }
    }

    const settingData = () => {
        let query = "INSERT INTO EMPLOYEE VALUES (?,?,?,?,?,?,?,?)"
        db.transaction((tx) => {
            tx.executeSql(query, [fName, lName, email, password, dob, pNo, gender, add])
        })

    }

    const updateDB = () => {
        const updateQuery = "UPDATE EMPLOYEE SET FName = ? , LName = ? , Email = ? , Password = ? , Dob = ? , PNo = ? , Gender = ? , Address = ? WHERE FName = ?"
        db.transaction((tx) => {
            tx.executeSql(updateQuery, [fName, lName, email, password, dob, pNo, gender, add, data.FName])
        })
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
                userId: pNo,
            })
        }).then(res => res.json())
            .then((res) => {
                console.log("res", res)
                props.navigation.navigate('List')
            }).catch((rej) => console.log("REJECTED", rej))
    }

    return (
        <KeyboardAwareScrollView
            style={styles.keyboard}
            // keyboardDismissMode="interactive"
            // keyboardShouldPersistTaps="always"
            automaticallyAdjustContentInsets={false}
        >
            <View style={styles.container}>
                <Header title='FORM' showIconBack={true} />

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
                    <View style={styles.email}>
                        <Text style={styles.text}>Password</Text>
                        <View style={styles.eye}>
                            <TextInput style={styles.inputField}
                                value={password}
                                onChangeText={(txt) => { setPassword(txt); }}
                                secureTextEntry={showPassword}
                            />
                            {showPassword ?
                            <TouchableOpacity onPress={()=>{setShowPassword(false)}}>
                                <Icon  name="eye"
                                    size={15}
                                /> 
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={()=>{setShowPassword(true)}}>
                                <Icon name="eye-slash"
                                    size={15}
                                />
                                </TouchableOpacity>
                                }
                        </View>
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
                        {isEdit ?  <Text style={styles.save}>Update</Text> :  <Text style={styles.save}>Save</Text> }
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>

    );
};


const styles = StyleSheet.create({
    keyboard: {
        // flex: 1,
    },
    container: {
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height / 1.2,
        backgroundColor: "#fff",
        alignItems: 'center',
        justifyContent: 'space-between',
        // flex:

    },
    subContainer: {
        height: "80%",
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
        height: "10%",
        alignItems: "center",
    },
    email: {
        height: "11%",
    },
    eye: {
        flexDirection: 'row',
        backgroundColor: 'white',
        alignItems: "center",

    },
    name: {
        width: "48%",
        height: "100%",
        flexDirection: 'column',
        justifyContent: "center",

    },
    nameInput: {
        width: "100%",
        borderColor: 'black',
        backgroundColor: 'white',
        padding: 0
    },
    inputField: {
        width: "95%",
        // height: "40%",
        borderColor: 'black',
        backgroundColor: 'white',
        // borderWidth: 2,
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
        height: "70%",
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
        zIndex: 1
    },
    ad: {
        height: "25%",
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