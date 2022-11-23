import React from 'react';
import Form from './screens/Form';
import List from './screens/List';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Newsfeed from './screens/Newsfeed';
import Details from './screens/Details';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import ToDo from './screens/ToDo';


const Tab = createBottomTabNavigator();
const InStack = createNativeStackNavigator();

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



const App = () => {

  return (
    <NavigationContainer>

      <Tab.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Tab.Screen
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
        <Tab.Screen
          name='Employees'
          component={InStackNavigation}
          options= {{
            tabBarIcon: ({color, size}) => {
              return(
                <Icon name="bars" color={color} size={size}  />
              )
            }
          }}
        />
        <Tab.Screen
          name= 'ToDo'
          component={ToDo}
          options={{
            tabBarIcon: ({color, size}) => {
              return(
                <Icon name="ellipsis-v" color={color} size= {size}  />
              )
            }
          }}
        />
      </Tab.Navigator>

    </NavigationContainer>
  );
};





export default App;
