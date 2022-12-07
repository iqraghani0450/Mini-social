import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import Header from '../components/Header'

const ToDo = () => {

  const [text, setText] = useState("")
  const [data, setData] = useState([])

  return (
    <View style={styles.container}>
      <Header title="To Do List" showIconBack={true} showIcon={true}/>
      <View style={styles.firstPart}>
        <TextInput
          style={styles.inputField}
          placeholder="Enter Items to the list"
          onChangeText={(txt) => { setText(txt) }}
          value={text}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setData([text, ...data])
            setText("")
          }}
        >
          <Icon
            name="plus"
            size={30}
            color="black"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.secondPart}>
        <FlatList
          style={styles.list}
          data={data}
          renderItem={({ item ,index}) => {
            return (
              <TouchableOpacity
                onLongPress={() => {
                data.splice(index, 1)
                setData([...data])
                }}
              >
                <Text style={styles.items}>- {item}</Text>
              </TouchableOpacity>
            )
          }}
        />
      </View>
    </View>
  )

}

export default ToDo

const styles = StyleSheet.create({

  container: {
    height: "100%",
    width: "100%"
  },
  firstPart: {
    height: "20%",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  inputField: {
    borderWidth: 1,
    height: "50%",
    width: '70%'
  },
  button: {
    borderWidth: 1,
    height: "50%",
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  secondPart: {
    height: "80%",
    padding: 12
  },
  items: {
    fontSize: 30
  }


})