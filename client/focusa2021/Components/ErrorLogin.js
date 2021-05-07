import React from 'react';
import {View,Text,StatusBar,Image} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styles from '../Styles/ErrorLoginStyles';


const ErrorLogin=({navigation})=>{
    return(
        <View style={styles.container1}>
    <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

    <View style={{alignItems:'center',backgroundColor:'white', justifyContent: 'center'}}>
        <Image style={styles.image} source={require('../assets/images/focusa2.png')}/>
        <Image  style={styles.focusaText} source={require('../assets/images/focusalogosmall.png')} />
        <TouchableOpacity style={styles.LoginOutButton} onPress={()=> navigation.navigate('Login')}>
            <Text style={{color:'white'}}>Login</Text>
        </TouchableOpacity>
    </View>
 </View>     
    )
}

export default ErrorLogin;