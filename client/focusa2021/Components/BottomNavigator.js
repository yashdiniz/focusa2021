import React, {useState} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Home from '../Activity/Home';
import Courses from '../Activity/courses';
import Login from '../Activity/Login';
import Profile from '../Activity/Profile';
import Video from '../Activity/Video';
import SubjectPage from '../Activity/SubjectPage';
// import CameraTest from '../Activity/cameraTest';

const Tab = createBottomTabNavigator();

function BottomNavigator() {
  const [token, setLoggedIn] = useState('');
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
          gestureEnabled: false,
          swipeEnabled: false,
        }}
      >
        {props => <Login {...props} setLoggedIn={setLoggedIn} token={token}/>}
      </Tab.Screen>

      <Tab.Screen
        name="SubjectPage"
        options={{
          tabBarLabel: 'SubjectPage',
          tabBarButton: () => null,
        }}
      >
        {props => <SubjectPage {...props} token={token}/>}
      </Tab.Screen>

      {/* <Tab.Screen
        name="CameraTest"
        options={{
          tabBarLabel: 'CameraTest',
          tabBarButton: () => null,
        }}
      >
        {props => <CameraTest {...props} token={token}/>}
      </Tab.Screen> */}

      <Tab.Screen
        name="Home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      >
        {props => <Home {...props} token={token}/>}
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
        {props => <Courses {...props} token={token}/>}
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
        {props => <Video {...props} token={token}/>}
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
        {props => <Profile {...props} token={token}/>}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default BottomNavigator;