import React, {useEffect} from 'react';
import {View,Text,StatusBar} from 'react-native';

const Profile = ({ navigation, route, login }) =>{
    useEffect(() => { if(!login) navigation.navigate('Login');});
    return(
        <View style={{alignItems:'center', justifyContent:'center'}}>
            <StatusBar backgroundColor = "#ffffff" barStyle="dark-content"/>
            <Text style={{fontSize: 20}}>This is the Profiles page</Text>
        </View>
    )
}

export default Profile