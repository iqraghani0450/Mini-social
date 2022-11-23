import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../components/Header'

const Details = (props) => {
    let {CommentText, DateAndTime, RepsName}=props?.route?.params.openDetail

  return (
    <View style= {styles.container}>
      <Header title={"Details"} showIcon={true} />
      <View style={styles.post}>
                    <View style={styles.namedate}>
                        <Text style={styles.text}>{RepsName}</Text>
                        <Text style={styles.text}>{DateAndTime}</Text>
                    </View>
                    <View style={styles.comment}>
                        <Text style={styles.text}>{CommentText}</Text>
                    </View>
                </View>
    </View>
  )
}

export default Details

const styles = StyleSheet.create({

container: {
    height: "100%",
    width: "100%"
},
post: {
    width: "90%",
    height: "88%",
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
text: {
    fontSize: 20
}


})