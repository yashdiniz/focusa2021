import React from 'react';
import {View,Text,StatusBar,Image,TouchableOpacity} from 'react-native';
import styles from '../Styles/videostyles'

import {ensureAuthenticated} from './ensureAuthenticated';

const Video = ({ navigation, route, token }) =>{
    ensureAuthenticated(navigation, token);
    return(
        <View style={styles.container}>
            <StatusBar backgroundColor = "#ffffff" barStyle="dark-content"/>
            <Image style={styles.image} source={require('../assets/images/focusa2.png')}/>
            <Image  style={styles.focusaText} source={require('../assets/images/focusalogosmall.png')} />

            <TouchableOpacity style={{
                    backgroundColor:'white', 
                    marginTop: 30,
                    width: 200, 
                    alignItems: 'center',
                    height: 40, 
                    justifyContent:'center',
                    borderColor: 'black',
                    borderWidth: 1,
                    borderRadius: 10}}>
                        <Text style={{fontSize: 20}}>Host Meeting</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{
                    backgroundColor:'white', 
                    marginTop: 30,
                    width: 200, 
                    alignItems: 'center',
                    height: 40, 
                    justifyContent:'center',
                    borderColor: 'black',
                    borderWidth: 1,
                    borderRadius: 10}}>
                        <Text style={{fontSize: 20}}>Join Meeting</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Video