import AsyncStorage from '@react-native-async-storage/async-storage'
import { CommonActions, useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { color } from 'react-native-reanimated'
import SQLite from 'react-native-sqlite-storage'
import Icon from 'react-native-vector-icons/FontAwesome'
import Header from '../components/Header'


const db = SQLite.openDatabase(
  {
    name: "Employees",
    location: 'default',
  },
  () => { },
  error => { console.log(error) }
)

const Login = (props) => {

  const navigation = useNavigation()
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(true)
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
          await AsyncStorage.setItem("Username", name)
          props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "LoggedIn" }]
            })
          );
        }
        else {
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
        "CREATE TABLE IF NOT EXISTS NEWSFEED (Name TEXT, DateOfPosting TEXT, CommentText TEXT,Base64 TEXT);"//1 is true 0 is false
      )
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
            style={styles.picture}
          />
          <TextInput
            style={styles.textField}
            placeholder='Username'
            placeholderTextColor={"black"}
            autoCapitalize={'none'}
            onChangeText={(txt) => setName(txt)}
          />
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              style={[styles.textField, { left: "15%" }]}
              placeholder="Password"
              secureTextEntry={showPassword}
              placeholderTextColor={"black"}
              autoCapitalize={'none'}
              onChangeText={(txt) => setPassword(txt)}
            />
            {showPassword ?
              <TouchableOpacity style={styles.eye} onPress={() => { setShowPassword(false) }}>
                <Icon name="eye"
                  size={15}
                />
              </TouchableOpacity>
              :
              <TouchableOpacity style={styles.eye} onPress={() => { setShowPassword(true) }}>
                <Icon name="eye-slash"
                  size={15}
                />
              </TouchableOpacity>
            }
          </View>
          <TouchableOpacity style={styles.button}
            onPress={() => { signIn() }}
          >
            <Text style={styles.text}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.create}
            onPress={() => { navigation.navigate("Form") }}
          >
            <Text style={styles.createColor}>Don't have an account? Sign up</Text>
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
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    margin: 5,
    padding: 5,
    color: "black",
    width: '90%'
  },
  picture: {
    width: "35%",
    alignSelf: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: "30%",
    height: "5%",
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
    textAlign: 'center',
  },
  create: {
    marginTop: 20,
  },
  createColor: {
    color: "black",
    fontSize: 15
  },
  eye: {
    justifyContent: "center",
    zIndex: 1,
    right: "45%"
  }


})