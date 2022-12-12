import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Form from '../screens/Form';
import List from '../screens/List';
import Login from '../screens/Login';
import Map from '../screens/Map';
import Newsfeed from '../screens/Newsfeed';
import Splash from '../screens/Splash';
import ToDo from '../screens/ToDo';

const InTab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


function InTabNavigation() {
  return (
    <InTab.Navigator
      initialRouteName='Employees'
      screenOptions={{
        headerShown: false,
      }}
    >
      <InTab.Screen
        name='Newsfeed'
        component={Newsfeed}
        options={{
          tabBarIcon: ({ color, size }) => {
            return (
              <Icon name="newspaper-o" color={color} size={size} />
            )
          }
        }}
      />
      <InTab.Screen
        name='Employees'
        component={List}
        options={{
          tabBarIcon: ({ color, size }) => {
            return (
              <Icon name="bars" color={color} size={size} />
            )
          }
        }}
      />
      <InTab.Screen
        name='ToDo'
        component={ToDo}
        options={{
          tabBarIcon: ({ color, size }) => {
            return (
              <Icon name="ellipsis-v" color={color} size={size} />
            )
          }
        }}
      />
      <InTab.Screen
        name='Map'
        component={Map}
        options={{
          tabBarIcon: ({ color, size }) => {
            return (
              <Icon name="map" color={color} size={size} />
            )
          }
        }}
      />
    </InTab.Navigator>
  );
}

const Navigation = () => {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>

        <Stack.Navigator
          initialRouteName={"Splash"}
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen
          name='Splash'
          component={Splash}
          />
          <Stack.Screen
            name="Login"
            component={Login}
          />
          <Stack.Screen
            name="LoggedIn"
            component={InTabNavigation}
          />
          <Stack.Screen
            name="Form"
            component={Form}
          />
        </Stack.Navigator>

      </NavigationContainer>
    </SafeAreaView>
  );
};





export default Navigation;
