import React, { useEffect, useState } from 'react';
import Form from './screens/Form';
import List from './screens/List';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Newsfeed from './screens/Newsfeed';
import Details from './screens/Details';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import ToDo from './screens/ToDo';
import { SafeAreaView } from 'react-native';
import Login from './screens/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Splash from './screens/Splash';


const InTab = createBottomTabNavigator();
const InStack = createNativeStackNavigator();
const Stack = createNativeStackNavigator();

function InStackNavigation() {

  return (
    <InStack.Navigator
      screenOptions={{
        headerShown: false
      }}>
      <InStack.Screen
        name='List'
        component={List}
      />
      <InStack.Screen
        name='Form'
        component={Form}
      />
    </InStack.Navigator>
  );
}

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
        component={InStackNavigation}
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
    </InTab.Navigator>
  );
}

const App = () => {

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
        </Stack.Navigator>

      </NavigationContainer>
    </SafeAreaView>
  );
};





export default App;
