import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Splash = () => {

  const navigation = useNavigation()
  useEffect(() => {
    setTimeout(() => { change() }, 2000)
  }, [])

  const change = async () => {
    const IsLoggedIn = await AsyncStorage.getItem("isLoggedIn")
    if (IsLoggedIn == "true") {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "LoggedIn" }]
        })
      );
    }
    else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }]
        })
      );

    }
  }

  return (
    <View style={styles.container}>
      <Icon name="stumbleupon-circle"
        size={120} color="#2D4874"
        style={styles.logo}
      />
      <Text style={styles.splash}>LETS GET STARTED</Text>
    </View>
  )
}

export default Splash

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignContent: 'center',
    height: "100%"
  },
  splash: {
    fontSize: 33,
    textAlign: 'center',
    color: "black"
  },
  logo: {
    alignSelf: 'center'
  }
})