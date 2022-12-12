import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useNavigation } from '@react-navigation/native';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';

const height= Dimensions.get("screen").height


const Header = forwardRef((props, ref) => {
    
    const navigation = useNavigation()
    const refRBSheet = useRef()

    const logout = () => {
        refRBSheet.current.close()
        setTimeout(async () => {

            await AsyncStorage.setItem("isLoggedIn", "false")
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: "Login" }]
                })
            );

        }, 800);
    }

    return (
        <View style={[{ justifyContent: props.showIcon ? 'space-between' : 'space-around' }, styles.header]}>
            {props.showIconBack ?
                <TouchableOpacity style={styles.box1}
                    onPress={() => { navigation.goBack() }}>
                    <Icon name="arrow-left"
                        size={25}
                        color="white"
                    />
                </TouchableOpacity>
                : null}
            <View style={styles.box2}>
                <Text style={styles.headerText}>{props.title}</Text>
            </View>

            {props.showIcon ?
                <TouchableOpacity style={styles.box3}
                    onPress={() => { refRBSheet.current.open() }}
                >
                    <Icon name="sign-out"
                        size={25}
                        style={styles.box3} color="white"
                    />

                </TouchableOpacity>
                : null}


            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={true}
                height={height/4}
                customStyles={{
                    container: {
                        borderTopRightRadius: 20,
                        borderTopLeftRadius: 20
                    }
                }}
            >
                <SafeAreaView>
                    <View style={styles.modalContainer}>
                        <Text style={[styles.modalText, { color: "black", height: "70%" }]}>Do you want to Logout?</Text>
                        <View style={styles.modalSubContainer}>
                            <TouchableOpacity style={styles.modalBtn}
                                onPress={() => { refRBSheet.current.close() }}>
                                <Text style={[styles.modalText, { color: "black" }]}>No</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: "#2D4874", }]}
                                onPress={() => { logout() }}>
                                <Text style={[styles.modalText, { color: "white" }]}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </RBSheet>
        </View>
    );
});

const styles = StyleSheet.create({
    header: {
        width: "100%",
        height: "7%",
        backgroundColor: "#2D4874",
        flexDirection: "row",
        alignItems: 'center',
    },
    box2: {
        flex: 1,
        width: '80%',
        alignItems: 'flex-start'
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 25,
        color: 'white',
        shadowColor: "#000",
        elevation: 5,
    },
    image: {
        height: '100%',
        width: '100%'
    },
    box3: {
        width: '25%',
        alignItems: 'flex-end',
        marginRight: 2
    },
    box1: {
        width: "35%",
        paddingLeft: 5
    },
    modalText: {
        fontSize: 20,
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    modalSubContainer: {
        flexDirection: "row",
        height: "30%",
        width: "100%",
        justifyContent: "center",
    },
    modalBtn: {
        width: "50%",
        height: "100%",
        backgroundColor: "#F1F1F1",
        alignItems: "center",
        justifyContent: "center"
    },
    modalContainer: {
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        height: "100%",
        width: "100%",
        justifyContent: "space-between"
    },

});



export default Header;