import React, {useEffect} from 'react';
import {View,Text,StatusBar} from 'react-native';

import {ensureAuthenticated} from './ensureAuthenticated';

const Profile = ({ navigation, route, login }) =>{
    ensureAuthenticated(navigation, login);
    return(
        <View style={{alignItems:'center', justifyContent:'center'}}>
            <StatusBar backgroundColor = "#ffffff" barStyle="dark-content"/>
            <Text style={{fontSize: 20}}>This is the Profiles page</Text>
        </View>
    )
}

export default Profile