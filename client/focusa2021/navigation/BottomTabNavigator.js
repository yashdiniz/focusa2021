/**
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
import React, {  } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import Profile from '../screens/Profile';
import Login from '../screens/Login';
import Courses from '../screens/Courses';
import CourseDetails from '../screens/CourseDetails';
import Settings from '../screens/Settings';
import { TouchableOpacity } from 'react-native';


const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    const colorScheme = useColorScheme();

    return (
        <BottomTab.Navigator
            initialRouteName="Profile"
            tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
            <BottomTab.Screen
                name="Profile"
                component={ProfileNavigator}
                options={{
                    tabBarIcon: ({ color }) => <TabBarIcon name="person-outline" color={color} />,
                }}
            />
            <BottomTab.Screen
                name="Courses"
                component={CoursesNavigator}
                options={{
                    tabBarIcon: ({ color }) => <TabBarIcon name="book-outline" color={color} />,
                }}
            />
            <BottomTab.Screen
                name="CourseDetails"
                component={CourseDetailsNavigator}
                options={{
                    tabBarButton: () => null,
                }}
            />
              <BottomTab.Screen
                name="Settings"
                component={SettingsNavigator}
                options={{
                    tabBarButton: () => null,
                }}
            />
            <BottomTab.Screen
                name="Login"
                component={LoginNavigator}
                options={{
                    tabBarButton: () => null,
                }}
            />
        </BottomTab.Navigator>
    );
}

// https://icons.expo.fyi/
function TabBarIcon(props) {
    return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const ProfileStack = createStackNavigator();
function ProfileNavigator({ navigation }) {
    return (
        <ProfileStack.Navigator>
            <ProfileStack.Screen
                name="ProfileScreen"
                component={Profile}
                options={{ headerTitle:'Profile',
                    // TODO: Add a settings button in header to take user to settings page.
                    headerRight: ()=>( <TouchableOpacity style={{paddingRight:20}} onPress={()=>navigation.navigate('Settings')}>
                        <TabBarIcon name="settings"/>
                    </TouchableOpacity>)
                }}
            />
        </ProfileStack.Navigator>
    );
}

const CoursesStack = createStackNavigator();
function CoursesNavigator() {
    return (
        <CoursesStack.Navigator>
            <CoursesStack.Screen
                name="CoursesScreen"
                component={Courses}
                options={{ headerStatusBarHeight:1, headerTitle:null }}
            />
        </CoursesStack.Navigator>
    );
}

const CourseDetailsStack = createStackNavigator();
function CourseDetailsNavigator() {
    return (
        <CourseDetailsStack.Navigator>
            <CourseDetailsStack.Screen
                name="CourseDetailsScreen"
                component={CourseDetails}
                options={{ headerStatusBarHeight:1, headerTitle:null }}
            />
        </CourseDetailsStack.Navigator>
    );
}

const SettingsStack = createStackNavigator();
function SettingsNavigator() {
    return (
        <SettingsStack.Navigator>
            <SettingsStack.Screen
                name="SettingsScreen"
                component={Settings}
                options={{  headerTitle:'Settings' }}
            />
        </SettingsStack.Navigator>
    );
}


const LoginStack = createStackNavigator();
function LoginNavigator() {
    return (
        <LoginStack.Navigator>
            <LoginStack.Screen
                name="LoginScreen"
                component={Login}
            />
        </LoginStack.Navigator>
    );
}