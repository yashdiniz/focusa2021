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
import Search from '../screens/Search';
import CourseDetails from '../screens/CourseDetails';
import Settings from '../screens/Settings';
import PublishPost from '../screens/PublishPost';
import PersonalPost from '../screens/PersonalPost';
import VideoConferencing from '../screens/VideoConferencing';
import { TouchableOpacity } from 'react-native';
import PostDetails from '../screens/PostDetails';
import { connectProps } from '../hooks/store';


const BottomTab = createBottomTabNavigator();

function BottomTabNavigator({ token }) {
    const colorScheme = useColorScheme();

    return (
        <BottomTab.Navigator
            initialRouteName="Profile"
            tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
            <BottomTab.Screen
                name="Login"
                component={LoginNavigator}
                options={{
                    tabBarIcon: ({ color }) => <TabBarIcon name="videocam-outline" color={color} />,
                    tabBarButton: () => null,
                }}
            />
            <BottomTab.Screen
                name="Profile"
                component={ProfileNavigator}
                options={{
                    tabBarIcon: ({ color }) => <TabBarIcon name="person-outline" color={color} />,
                }}
            />
            <BottomTab.Screen
                name="Search"
                component={SearchNavigator}
                options={{
                    tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
                }}
            />

            <BottomTab.Screen
                name="PersonalPost"
                component={PersonalPostNavigator}
                options={{
                    tabBarButton: () => null,
                }}
            />

            <BottomTab.Screen
                name="PublishPost"
                component={PublishPostNavigator}
                options={{
                    tabBarButton: () => null,
                }}
            />
            <BottomTab.Screen
                name="PostDetails"
                component={PostDetailsNavigator}
                options={{
                    tabBarButton: () => null,
                    tabBarVisible: false
                }}
            />

            <BottomTab.Screen
                name="Meetings"
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
        </BottomTab.Navigator>
    );
}

export default connectProps(BottomTabNavigator);

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

const SearchStack = createStackNavigator();
function SearchNavigator() {
    return (
        <SearchStack.Navigator>
            <SearchStack.Screen
                name="SearchScreen"
                component={Search}
                options={{ headerTitle: "Search" }}
            />
        </SearchStack.Navigator>
    );
}

const PersonalPostStack = createStackNavigator();
function PersonalPostNavigator({ navigation }) {
    return (
        <PersonalPostStack.Navigator>
            <PersonalPostStack.Screen
                name="PersonalPostScreen"
                component={PersonalPost}
                options={{
                    headerTitle: "Personal Posts",
                    headerLeft: () => (<TouchableOpacity style={{ paddingStart: 20 }} onPress={() => navigation.goBack()}>
                        <TabBarIcon name="arrow-back" color="red" />
                    </TouchableOpacity>)
                }}
            />
        </PersonalPostStack.Navigator>
    );
}

const PostDetailsStack = createStackNavigator();
function PostDetailsNavigator({ navigation }) {
    return (
        <PostDetailsStack.Navigator>
            <PostDetailsStack.Screen
                name="PostDetailsScreen"
                component={PostDetails}
                options={{
                    headerTitle: "Comments",
                    headerLeft: () => (<TouchableOpacity style={{ paddingStart: 20 }} onPress={() => navigation.goBack()}>
                        <TabBarIcon name="arrow-back" color="red" />
                    </TouchableOpacity>)
                }}
            />
        </PostDetailsStack.Navigator>
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
                    headerLeft: () => (<TouchableOpacity style={{ paddingStart: 20 }} onPress={() => navigation.goBack()}>
                        <TabBarIcon name="arrow-back" color="red" />
                    </TouchableOpacity>)
                }}
            />
        </CourseDetailsStack.Navigator>
    );
}

const PublishPostStack = createStackNavigator();
function PublishPostNavigator({ navigation }) {
    return (
        <PublishPostStack.Navigator>
            <PublishPostStack.Screen
                name="PublishPostScreen"
                component={PublishPost}
                options={{
                    headerTitle: "Publish Post",
                    headerLeft: () => (<TouchableOpacity style={{ paddingStart: 20 }} onPress={() => navigation.goBack()}>
                        <TabBarIcon name="arrow-back" color="red" />
                    </TouchableOpacity>)
                }}
            />
        </PublishPostStack.Navigator>
    );
}

const VideoConferencingStack = createStackNavigator();
function VideoConferencingNavigator() {
    return (
        <VideoConferencingStack.Navigator>
            <VideoConferencingStack.Screen
                name="VideoConferencingScreen"
                component={VideoConferencing}
                options={{ headerTitle: "Meetings" }}
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
                    headerLeft: () => (<TouchableOpacity style={{ paddingStart: 20 }} onPress={() => navigation.goBack()}>
                        <TabBarIcon name="arrow-back" color={"red"} />
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