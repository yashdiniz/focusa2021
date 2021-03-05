import React, {useState} from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Home from '../Activity/Home';
import Courses from '../Activity/courses';
import Login from '../Activity/Login';
import Profile from '../Activity/Profile';
import Video from '../Activity/Video';
import SubjectPage from '../Activity/SubjectPage'

const Tab = createBottomTabNavigator();

function BottomNavigator() {
  const [login, setLoggedIn] = useState('');
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: '#e91e63',
      }}
    >
      <Tab.Screen
        name="Login"
        options={{
          tabBarVisible: false,
          tabBarLabel: 'Login',
          tabBarButton: () => null,
        }}
      >
        {props => <Login {...props} setLoggedIn={setLoggedIn}/>}
      </Tab.Screen>

      <Tab.Screen
        name="SubjectPage"
        options={{
          tabBarLabel: 'SubjectPage',
          tabBarButton: () => null,
        }}
      >
        {props => <SubjectPage {...props} login={login}/>}
      </Tab.Screen>

      <Tab.Screen
        name="Home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      >
        {props => <Home {...props} login={login}/>}
      </Tab.Screen>

      <Tab.Screen
        name="Courses"
        options={{
          tabBarLabel: 'Courses',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="book-open" color={color} size={size} />
          ),
        }}
      >
        {props => <Courses {...props} login ={login}/>}
      </Tab.Screen>
      <Tab.Screen
        name="Video"
        options={{
          tabBarLabel: 'Video',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="video" color={color} size={size} />
          ),
        }}
      >
        {props => <Video {...props} login ={login}/>}
      </Tab.Screen>
      <Tab.Screen
        name="Profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      >
        {props => <Profile {...props} login ={login}/>}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default BottomNavigator;