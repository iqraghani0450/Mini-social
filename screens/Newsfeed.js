import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions, ActivityIndicator, Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Header from '../components/Header'
import { useNavigation } from '@react-navigation/native'
import Modal from "react-native-modal"
import SQLite from 'react-native-sqlite-storage'
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'
import RBSheet from 'react-native-raw-bottom-sheet'
import { SafeAreaView } from 'react-native-safe-area-context'


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
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
    const [indicator, setIndicator] = useState(false)
    const [base, setBase] = useState("")
    const [openModal, setOpenModal] = useState(false)
    const navigation = useNavigation()
    const checkRef = useRef()
    const RBSheetRef = useRef()
    let arr = []


    useEffect(() => {
        setIndicator(true);
        GettingData()
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



    const onPost = async () => {
        let username = await AsyncStorage.getItem("Username")
        let InsertQuery = "INSERT INTO NEWSFEED VALUES (?,?,?,?)"
        let date = new Date().getDate() + "/" + parseInt(new Date().getMonth() + 1) + "/" + new Date().getFullYear()
        let hour = new Date().getHours() % 12 || 12
        let mins = new Date().getMinutes()
        let ampm = new Date().getHours() > 12 ? "PM" : "AM"
        let dateAndTime = (date + " " + hour + ":" + mins + " " + ampm)
        db.transaction((tx) => {
            tx.executeSql(InsertQuery, [username, dateAndTime, text, base], (tx, result) => {
                console.log(result)
            })
        })
        setText("")
        GettingData()
        setBase("")
        console.log(checkRef.current.saysHello("Iqra"))
    }


    const onTakePhoto = async () => {
        await ImagePicker.openCamera({
            width: 200,
            height: 200,
            mediaType: "photo",
            includeBase64: true,
            compressImageQuality: 0.8
        }).then(image => {
            setBase(image.data)
            RBSheetRef.current.close()
        }).catch(err => {
            console.log(err)
        })
    }

    const onChooseFromGallery = async () => {

        await ImagePicker.openPicker({
            width: 300,
            height: 400,
            includeBase64: true,
        }).then(image => {
            setBase(image.data)
            RBSheetRef.current.close()
        }).catch(err => {
            console.log(err)
        })

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
            tx.executeSql(DeleteQuery, [CommentText], (tx, results) => {
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
                    <View style={{flexDirection: 'row', width: windowWidth/1.3}}>
                    <TouchableOpacity style={styles.postButton}
                        onPress={() => { RBSheetRef.current.open() }}
                    >
                        <Text style={styles.text}>Upload</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setOpenModal(true) }}>
                    <Image source={{ uri: "data:image/png;base64," + base }} style={{ height: 20, width: 20, margin: 3}}/>
                    </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={[styles.postButton, {width: windowWidth/7.7}]}
                        onPress={() => { setIndicator(true); onPost() }}
                    >
                        <Text style={styles.text}>Post</Text>
                    </TouchableOpacity>
                </View>

<Modal isVisible={openModal} onBackButtonPress={() => {setOpenModal(false)}} onBackdropPress={() => {setOpenModal(false)}}>
    <Image source={{ uri: "data:image/png;base64," + base }} style={{ height: "70%", width: "70%", alignSelf: 'center'}}/>
</Modal>

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
                onLongPress={() => { DeleteData(item.CommentText) }}
            >
                <View style={styles.post}>
                    <View style={styles.namedate}>
                        <Text>{item.Name}</Text>
                        <Text>{item.DateOfPosting}</Text>
                    </View>
                    <View style={styles.comment}>
                        <Text style={{ fontSize: 18 }}>{item.CommentText}</Text>
                        {item.Base64 != "" ?
                            <Image source={{ uri: "data:image/png;base64," + item.Base64 }} style={{ height: windowHeight/4, width: windowWidth/4, marginTop: 7 }} />
                            : null}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }





    return (
        <View style={styles.container}>
            <Header title="Newsfeed" showIcon={true} ref={checkRef} />
            {
                <FlatList
                    data={resp}
                    renderItem={renderData}
                    ListHeaderComponent={FlatList_Header()}
                    ListFooterComponent={FlatList_Footer}
                />
            }

            <RBSheet
                ref={RBSheetRef}
                closeOnDragDown={true}
                closeOnPressMask={true}
                height={120}
            >

                <SafeAreaView>
                    <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'space-around', height: "100%" }}>
                        <TouchableOpacity style={styles.photoBtn}
                            onPress={() => { onTakePhoto() }}
                        >
                            <Text style={{ color: "white", fontSize: 14 }}>Take Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.photoBtn}
                            onPress={() => { onChooseFromGallery() }}
                        >
                            <Text style={{ color: "white", fontSize: 14 }}>Choose From Gallery</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>

            </RBSheet>
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
        flexDirection: 'row',
        width: "100%",
        height: "20%",
        justifyContent: 'flex-start',
        paddingHorizontal: 18,
        paddingTop: 10,
    },
    postButton: {
        borderWidth: 2,
        alignItems: 'center',
        backgroundColor: '#2D4874'
    },
    text: {
        fontWeight: '600',
        color: 'white'
    },
    post: {
        width: "90%",
        flex: 1,
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
        padding: 7,
    },
    photoBtn: {
        width: "40%",
        alignItems: 'center',
        justifyContent: 'center',
        height: "60%",
        borderRadius: 20,
        backgroundColor: "#2D4874"
    }


})