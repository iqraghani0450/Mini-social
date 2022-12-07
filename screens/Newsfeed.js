import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { useNavigation } from '@react-navigation/native'
import Modal from "react-native-modal"
import SQLite from 'react-native-sqlite-storage'
import { getCalendarDateString } from 'react-native-calendars/src/services'
import { min } from 'react-native-reanimated'

const windowHeight = Dimensions.get('window').height;

const db = SQLite.openDatabase(
    {
        name: "Employees",
        location: 'default'
    },
    () => { },
    error => { console.log(error) }
)

const Newsfeed = () => {

    const [resp, setResp] = useState([])
    const [text, setText] = useState("")
    const navigation = useNavigation()
    let arr = []


    useEffect(() => {
        setIndicator(true);
        GettingData()
        //    let test =



        // getPosts()

    }, [])

    // const InsertingData = () => {
    //    let query="INSERT INTO NEWSFEED VALUES (?,?,?)"
    //     db.transaction((tx) => {
    //         tx.executeSql(query , [Name, DateOfPosting, CommentText ])
    //     })
    //     GettingData()
    // }
    // const dummyData = () => {

    // }
   

    const onPost = () => {

        let InsertQuery = "INSERT INTO NEWSFEED VALUES (?,?,?)"
        let date = new Date().getDate() + "/" + parseInt(new Date().getMonth() + 1) + "/" + new Date().getFullYear()
        let hour = new Date().getHours() % 12 || 12
        let mins = new Date().getMinutes()
        let ampm = new Date().getHours() > 12 ? "PM" : "AM"
        let dateAndTime = (date + " " + hour + ":" + mins + " " + ampm)

        db.transaction((tx) => {
            tx.executeSql(InsertQuery, [Name, dateAndTime, text])
        })
        setText("")
        GettingData()
    }

    const GettingData = async () => {
        let SelectQuery = "SELECT * FROM NEWSFEED"
        db.transaction((tx) => {
            tx.executeSql(SelectQuery, [], (tx, results) => {
                for (let i = 0; i < results.rows.length; i++) {
                    arr.push(results.rows.item(i))
                }
                setResp([...arr].reverse())

            })
        })
    }

        const DeleteData = (CommentText) => {
            let DeleteQuery = "DELETE FROM NEWSFEED WHERE CommentText = ?"
            db.transaction((tx) => {
                tx.executeSql(DeleteQuery, [CommentText], (tx,results) => {
                })
            })
            GettingData()
        }


    // const getPosts = () => {
    //     fetch("https://www.engage.salesflo.com/api/app/news-feed/get", {
    //         method: "POST",
    //         headers: {
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({ "RepsId": 3967 })
    //     }
    //     ).then(res => res.json())
    //         .then((res) => {
    //             setResp(res.data)
    //             setIndicator(false)
    //         })
    //         .catch((rej) => {
    //         })
    // }

    // const onPost = () => {
    //     fetch("https://www.engage.salesflo.com/api/app/news-feed/post", {
    //         method: "POST",
    //         headers: {
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             "RepsId": 3967,// hard code
    //             "RepName": "mashad",
    //             "CommentText": text,
    //             "AvatarNo": "0",//hardcode
    //             "ImageName": null, //hardcode
    //             "ImageBase64": null //hardcode
    //         })
    //     }).then(res => res.json())
    //         .then((res) => {
    //             setText('')
    //             getPosts()
    //         }).catch((rej) => {
    //             console.log(rej);
    //         })

    // }





    const FlatList_Header = () => {
        return (
            <View style={styles.inputView}>
                <TextInput
                    style={styles.inputField}
                    multiline={true}
                    numberOfLines={20}
                    onChangeText={(txt) => setText(txt)}
                    value={text}
                />
                <View style={styles.button}>
                    <TouchableOpacity style={styles.postButton}
                        onPress={() => { setIndicator(true); onPost() }}
                    >
                        <Text style={styles.text}>Post</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    const FlatList_Footer = () => {
        return (
            <View style={{ margin: 24 }} />
        );
    }




    const renderData = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => { navigation.navigate("Details", { openDetail: item }) }}
                onLongPress={()=> {DeleteData(item.CommentText)}}
            >
                <View style={styles.post}>
                    <View style={styles.namedate}>
                        <Text>{item.Name}</Text>
                        <Text>{item.DateOfPosting}</Text>
                    </View>
                    <View style={styles.comment}>
                        <Text>{item.CommentText}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }





    return (
        <View style={styles.container}>
            <Header title="Newsfeed" showIcon={true} />
            {
                <FlatList
                    data={resp}
                    renderItem={renderData}
                    ListHeaderComponent={FlatList_Header()}
                    ListFooterComponent={FlatList_Footer}
                />
            }
        </View>



    )
}

export default Newsfeed

const styles = StyleSheet.create({

    container: {
        height: "100%",
        width: "100%",
    },
    inputView: {
        height: windowHeight / 3.33,
        paddingTop: 25,
        alignItems: 'center',
    },
    inputField: {
        borderColor: "black",
        borderWidth: 2,
        width: "90%",
        height: "80%",
        textAlignVertical: 'top'

    },
    button: {
        width: "100%",
        height: "20%",
        alignItems: 'flex-end',
        paddingRight: 18,
        paddingTop: 10,
    },
    postButton: {
        borderWidth: 2,
        width: "15%",
        alignItems: 'center',
        backgroundColor: '#2D4874'
    },
    text: {
        fontWeight: '600',
        color: 'white'
    },
    post: {
        width: "90%",
        height: windowHeight / 6,
        alignSelf: 'center',
        marginTop: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
        backgroundColor: '#EFEEF5'

    },
    namedate: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 7
    },
    comment: {
        alignItems: 'flex-start',
        padding: 7
    },


})