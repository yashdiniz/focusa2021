import React, {useEffect} from 'react';
import {View,Text,StatusBar} from 'react-native';

const Video = ({ navigation, route, login }) =>{
    useEffect(() => { if(!login) navigation.navigate('Login');});
    return(
        <View style={{alignItems:'center', justifyContent:'center'}}>
            <StatusBar backgroundColor = "#ffffff" barStyle="dark-content"/>
            <Text style={{fontSize: 20}}>This is the Video Conferance page</Text>
        </View>
    )
}

export default Video