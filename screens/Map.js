import { PermissionsAndroid, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import Geolocation from 'react-native-geolocation-service'
import Icon from 'react-native-vector-icons/FontAwesome'
import { FlatList } from 'react-native-gesture-handler'

const Map = () => {

  const [long, setLong] = useState(0)
  const [lat, setLat] = useState(0)
  const back = useRef()
  const locations = [
    { latitude: 25.40452886225312, longitude: 68.32728105700944 },
    { latitude: 25.412348853646748, longitude: 68.33802622180428 },
    { latitude: 25.395283962171934, longitude: 68.33278545714347 },
    { latitude: 25.38830543776189, longitude: 68.34154018686651 },
    { latitude: 25.423814174749356, longitude: 68.34132561169426 }
  ]

  useEffect(() => {

    liveLocation()

  }, [])

  const liveLocation = async () => {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    if (granted == PermissionsAndroid.RESULTS.GRANTED) {
      Geolocation.getCurrentPosition(
        (position) => {
          setLong(position.coords.longitude)
          setLat(position.coords.latitude)
        },
        (error) => {
          console.log(error)
        }
      )
    }
  }
  const MoveToLocation = () => {
    back.current.animateToRegion({
      latitude: lat,
      longitude: long,
      latitudeDelta: 0.015,
      longitudeDelta: 0.015
    })
  }


  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        ref={back}
        region={{
          latitude: lat,
          longitude: long,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}

      >
        <Marker
          coordinate={{ latitude: lat, longitude: long }}
          style={{zIndex: 1}}
        >
          <Icon name={"map-pin"} size={35} color={"#2D4874"} />
        </Marker>
        
        {locations.map((item, index) => {
          return (
            <Marker
              key={index}
              coordinate={{ latitude: item.latitude, longitude: item.longitude }}
            >
              <Icon name={"map-signs"} size={35} color={"red"} />

            </Marker>
          )
        })}

      </MapView>
      <TouchableOpacity style={{ alignSelf: 'flex-end', bottom: 40, right: 20, backgroundColor: "white", borderRadius: 60 }} onPress={() => { MoveToLocation() }}>
        <Icon name={"safari"} size={40} color={"#2D4874"} />
      </TouchableOpacity>
    </View>
  )
}

export default Map
const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});