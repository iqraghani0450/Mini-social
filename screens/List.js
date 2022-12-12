import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../components/Header';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const db = SQLite.openDatabase(
    {
        name: "Employees",
        location: 'default',
    },
    () => { },
    error => { console.log(error) }
)

const List = (props) => {

    useFocusEffect(
        React.useCallback(() => {
            getDataFromDB()
        }, [])
    )

    const navigation = useNavigation()
    const [data, setData] = useState([])

    const getDataFromDB = () => {
        const query = "SELECT * FROM EMPLOYEE"
        let arr = []

        db.transaction((tx) =>
            tx.executeSql(query, [], (tx, results) => {

                for (let i = 0; i < results.rows.length; i++) {
                    arr.push(results.rows.item(i))
                }
                setData(arr)
            })
        )
    }

    const renderDummy = ({ item, index }) => {
        return (
            item.FName != "admin" &&
                <TouchableOpacity
                    onPress={() => { navigation.navigate('Form', { data: item, index: index, isEdit: true }) }}
                    style={styles.listItems}>
                    <Icon
                        style={styles.icon}
                        name="star"
                        size={15}
                        color="#4CFF21"
                    />

                    <View style={styles.listItemFirst}>
                        <Text style={styles.year}>{item.FName}</Text>
                    </View>
                    <View style={styles.subListItems}>
                        <Text style={styles.Text}> Expense= 100 </Text>
                        <Text style={styles.Text}> Income= 100 </Text>
                    </View>

                </TouchableOpacity>
        )
    }

    const footer = () => {
        return (
            <View style={{ margin: 24 }}></View>
        )
    }

    return (
        <View style={styles.Container}>
            <Header title='EMPLOYEES' showIcon={true} />
            <FlatList
                numColumns={2}
                data={data}
                renderItem={renderDummy}
                ListFooterComponent={footer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F4F6F9',
    },

    FloatingActionButtonStyle: {
        height: "8%",
        width: "14%",
        borderRadius: 100,
        position: 'absolute',
        backgroundColor: '#DB3804',
        bottom: 30,
        right: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: {
            width: 2,
            height: 5,
        },
        shadowColor: "black",
        elevation: 10,
    },

    FloatingActionButtonImageStyle: {
        width: "40%",
        height: "40%",
        resizeMode: 'contain',
        tintColor: '#FFFFFF'
    },
    listItems: {
        backgroundColor: "white",
        borderRadius: 12,
        marginTop: 10,
        height: windowHeight / 5,
        width: windowWidth / 2.12,
        justifyContent: 'flex-end',
        margin: 5,
        shadowOffset: {
            width: 2,
            height: 5,
        },
        shadowColor: "black",
        elevation: 5,
    },
    subListItems: {
        height: "35%",
        backgroundColor: "#2D4874",
        justifyContent: 'center',
        borderBottomRightRadius: 12,
        borderBottomLeftRadius: 12
    },
    Text: {
        fontSize: windowHeight / 50,
        color: 'white'
    },
    listItemFirst: {
        alignItems: 'center',
        justifyContent: 'center',
        height: "50%"
    },
    icon: {
        alignSelf: 'flex-start',
        paddingLeft: 7,
        paddingTop: 3,
        height: "15%"
    },
    month: {
        fontSize: 22,
        fontWeight: 'bold'
    },
    year: {
        fontSize: 15,
        color: "black",
        fontWeight: 'bold',
    }
});




export default List;