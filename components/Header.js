import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import Modal from "react-native-modal";

const Header = (props) => {
    const navigation = useNavigation()
    const [showModal, setShowModal] = useState(false)
    return (
        <View style={styles.header}>
            {props.showIcon ?
                <TouchableOpacity
                    onPress={() => { navigation.goBack()}}>
                    <Icon name="arrow-left"
                        size={25}
                        color="white"
                    />
                </TouchableOpacity>
                : null}
            <View style={styles.items}>
                <Text style={styles.headerText}>{props.title}</Text>
            </View>
            <TouchableOpacity style={styles.info}
                onPress={() => { setShowModal(true) }}>
                <Icon name="info"
                    size={25}
                    color="white"
                />
            </TouchableOpacity>
            <Modal isVisible={showModal}>
                <Image style={styles.image} source={require("../images/hu.jpg")}></Image>
            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        width: "100%",
        height: "7%",
        backgroundColor: "#2D4874",
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    items: {
        flexDirection: 'row'
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
    info: {
        marginRight: 25
    }
});



export default Header;