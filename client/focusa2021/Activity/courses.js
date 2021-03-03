import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { isLoggedIn } from './singletonStates'; 

const Courses = ({ navigation, route, loggedIn }) =>{
    if(!isLoggedIn()) navigation.navigate('Login');
    return(
        <View style={{alignItems:'center', justifyContent:'center'}}>
            <StatusBar backgroundColor = "#ffffff" barStyle="dark-content"/>
            <Text style={{fontSize: 20}}>This is the Courses page</Text>
        </View>
    )
}

export default Courses;