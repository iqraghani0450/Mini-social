import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import ImagePicker from 'react-native-image-crop-picker'
import Modal from "react-native-modal"
import RBSheet from 'react-native-raw-bottom-sheet'
import { SafeAreaView } from 'react-native-safe-area-context'
import SQLite from 'react-native-sqlite-storage'
import Header from '../components/Header'


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
    const [base, setBase] = useState("")
    const [openModal, setOpenModal] = useState(false)
    const navigation = useNavigation()
    const checkRef = useRef()
    const RBSheetRef = useRef()
    let arr = []


    useEffect(() => {
        GettingData()
    }, [])


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
                    <View style={styles.postAndUpload}>
                        <TouchableOpacity style={styles.uploadButton}
                            onPress={() => { RBSheetRef.current.open() }}
                        >
                            <Text style={styles.text}>Upload</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setOpenModal(true) }}>
                            <Image source={{ uri: "data:image/png;base64," + base }} style={styles.smallImage} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.postButton}
                        onPress={() => { onPost() }}
                    >
                        <Text style={styles.text}>Post</Text>
                    </TouchableOpacity>
                </View>

                <Modal isVisible={openModal} onBackButtonPress={() => { setOpenModal(false) }} onBackdropPress={() => { setOpenModal(false) }}>
                    <Image source={{ uri: "data:image/png;base64," + base }} style={styles.openImage} />
                </Modal>

            </View>
        );
    }
    const FlatList_Footer = () => {
        return (
            <View style={styles.footer} />
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
                        <Text style={styles.description}>{item.CommentText}</Text>
                        {item.Base64 != "" ?
                            <Image source={{ uri: "data:image/png;base64," + item.Base64 }} style={styles.bigImage} />
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
                height={windowHeight/4}
            >

                <SafeAreaView>
                    <View style={styles.TakeOrChoose}>
                        <TouchableOpacity style={styles.photoBtn}
                            onPress={() => { onTakePhoto() }}
                        >
                            <Text style={styles.cameraText}>Take Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.photoBtn}
                            onPress={() => { onChooseFromGallery() }}
                        >
                            <Text style={styles.cameraText}>Choose From Gallery</Text>
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
    uploadButton: {
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: "center",
        width: windowWidth / 5.9,
        backgroundColor: '#2D4874',
    },
    smallImage: {
        height: 20,
        width: 20,
        margin: 3
    },
    postButton: {
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2D4874',
        width: windowWidth / 7.7
    },
    openImage: {
        height: "70%",
        width: "70%",
        alignSelf: 'center'
    },
    bigImage: {
        height: windowHeight / 4,
        width: windowWidth / 4,
        marginTop: 7
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
    postAndUpload: {
        flexDirection: 'row',
        width: windowWidth / 1.3
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
    description: {
        fontSize: 18
    },
    photoBtn: {
        width: "40%",
        alignItems: 'center',
        justifyContent: 'center',
        height: "40%",
        borderRadius: 20,
        backgroundColor: "#2D4874"
    },
    TakeOrChoose: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-around',
        height: "100%"
    },
    cameraText: {
        color: "white",
        fontSize: 14
    },
    footer: {
        margin: 24
    }


})