/**
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
import React, { } from 'react';
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
import VideoConferencing from '../screens/VideoConferencing';
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
                name="Video Conferencing"
                component={VideoConferencingNavigator}
                options={{
                    tabBarIcon: ({ color }) => <TabBarIcon name="videocam-outline" color={color} />,
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
                options={{
                    headerTitle: 'Profile',
                    // TODO: Add a settings button in header to take user to settings page.
                    headerRight: () => (<TouchableOpacity style={{ paddingRight: 20 }} onPress={() => navigation.navigate('Settings')}>
                        <TabBarIcon name="settings" />
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
                options={{ headerTitle: "Courses" }}
            />
        </CoursesStack.Navigator>
    );
}

const CourseDetailsStack = createStackNavigator();
function CourseDetailsNavigator({ navigation }) {
    return (
        <CourseDetailsStack.Navigator>
            <CourseDetailsStack.Screen
                name="CourseDetailsScreen"
                component={CourseDetails}
                options={{
                    headerTitle: "Course Details",
                    headerLeft: () => (<TouchableOpacity style={{ paddingLeft: 20 }} onPress={() => navigation.goBack()}>
                        <TabBarIcon name="arrow-back" color="red" />
                    </TouchableOpacity>)
                }}
            />
        </CourseDetailsStack.Navigator>
    );
}

const VideoConferencingStack = createStackNavigator();
function VideoConferencingNavigator() {
    return (
        <VideoConferencingStack.Navigator>
            <VideoConferencingStack.Screen
                name="CourseDetailsScreen"
                component={VideoConferencing}
                options={{ headerTitle: "Video Conferencing" }}
            />
        </VideoConferencingStack.Navigator>
    );
}

const SettingsStack = createStackNavigator();
function SettingsNavigator({ navigation }) {
    return (
        <SettingsStack.Navigator>
            <SettingsStack.Screen
                name="SettingsScreen"
                component={Settings}
                options={{
                    headerTitle: 'Settings',
                    headerLeft: () => (<TouchableOpacity style={{ paddingLeft: 20 }} onPress={() => navigation.goBack()}>
                        <TabBarIcon name="arrow-back" />
                    </TouchableOpacity>)
                }}
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