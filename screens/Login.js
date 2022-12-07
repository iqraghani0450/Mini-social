import { StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, Keyboard, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import SQLite from 'react-native-sqlite-storage'
import { StackActions, NavigationActions, CommonActions } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from 'react-native-vector-icons/FontAwesome';


const db = SQLite.openDatabase(
  {
    name: "Employees",
    location: 'default',
  },
  () => { },
  error => { console.log(error) }
)

const Login = (props) => {

  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  let checkname = ""
  let checkpassword = ""

  useEffect(() => {
    createTable()

  }, [])

  const signIn = async () => {
    let nameQuery = "SELECT FName, Password FROM EMPLOYEE WHERE FName = ? AND Password = ?"
    await db.transaction(async (tx) => {
      await tx.executeSql(nameQuery, [name, password], async (tx, results) => {

        checkname = results.rows.item(0)?.FName
        checkpassword = results.rows.item(0)?.Password

        if (name == checkname && password == checkpassword) {
          await AsyncStorage.setItem("isLoggedIn", "true")
          props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "LoggedIn" }]
            })
          );
        } else {
          alert("Wrong username or password")
        }
      })

    })

  }

  const createTable = () => {

    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS EMPLOYEE (FName TEXT, LName TEXT, Email TEXT, Password TEXT, Dob NUMBER, PNo NUMBER, Gender TEXT, Address TEXT);"
      )
    })
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS NEWSFEED (Id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL , Name TEXT, DateOfPosting TEXT, CommentText TEXT);"
      )
    })
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO EMPLOYEE VALUES (?,?,?,?,?,?,?,?)", ['admin', '', '', 'admin', '', '', '', '']
      )
    })

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM EMPLOYEE", [])
    })

  }

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
    >
      <View style={styles.container}>
        <Header title="Login" />
        <View style={styles.subcontainer}>
          <Icon name="stumbleupon"
          size={120} color="#2D4874"
          style = {styles.picture}
          />
          <TextInput
            style={styles.textField}
            placeholder='                                     Username'
            onChangeText={(txt) => setName(txt)}
          />
          <TextInput
            style={styles.textField}
            placeholder="                                     Password"
            secureTextEntry={true}
            onChangeText={(txt) => setPassword(txt)}
          />
          <TouchableOpacity style={styles.button}
            onPress={() => { signIn() }}
          >
            <Text style={styles.text}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default Login

const styles = StyleSheet.create({

  container: {
    height: "100%",
    width: "100%",
  },
  subcontainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textField: {
    width: '90%',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    margin: 5,
    padding: 5,
  },
  picture: {
    width: "35%",
    alignSelf: 'center',
  },
  button: {
    alignItems: 'center',
    paddingTop: 20,
    width: "30%",
  },
  text: {
    borderRadius: 5,
    fontWeight: 'bold',
    fontSize: 15,
    borderColor: 'black',
    color: "white",
    backgroundColor: "#2D4874",
    padding: 4,
    width: "100%",
    height: "22%",
    textAlign: 'center',
    
  }


})