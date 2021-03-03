import React from 'react';
import { View, Text } from 'react-native';
import { isLoggedIn } from './singletonStates'; 

const Courses = ({ navigation, route, loggedIn }) =>{
    if(!isLoggedIn()) navigation.navigate('Login');
    return(
        <View>
            <Text>
                Hello world
            </Text>
        </View>
    )
}

export default Courses;