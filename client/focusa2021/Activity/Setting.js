import React from 'react';
import {Text, View, Dimensions, StatusBar} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from '../Styles/SettingStyle';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Setting =({navigation}) =>{
    return(
        <View style={styles.container}>
           <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
           <TouchableOpacity style={{paddingLeft: 20}} onPress={()=>navigation.goBack()}>
                <MaterialCommunityIcons name="arrow-left" size={25} style={{marginTop: 19,}} />
           </TouchableOpacity>
           <View style={{alignItems:'center',backgroundColor:'white', position:'absolute', bottom:0, marginBottom: 20}}>
           <TouchableOpacity style={styles.LoginOutButton}>
               <Text style={{color:'white'}}>Login</Text>
           </TouchableOpacity>
           </View>
        </View>
    )
}

export default Setting;