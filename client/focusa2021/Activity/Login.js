import React, { useState, Component } from 'react';
import { View,Text,StatusBar,Image, TextInput } from 'react-native';
import styles from '../Styles/LoginStyles';
import * as Font from 'expo-font';



class Login extends Component{

    async loadFonts() {
        await Font.loadAsync({
            ZCOOLKuaiLe: require('../assets/fonts/ZCOOLKuaiLe.ttf')})
    }
    UNSAFE_componentWillMount(){
        this.loadFonts();
    }
    componentDidMount(){
        this.loadFonts();
    }
    componentDidUpdate(){
        this.loadFonts();
    }

    render(){
        return(
            <View style={styles.container}>
                <StatusBar backgroundColor = "#000000" barStyle="light-content"/> 
                <Image style={styles.image} source={require('../assets/images/focusa2.png')}/>
                <Text style={styles.focusa}>FOCUSA</Text>
                <TextInput style={styles.inputBox} placeholder="Username"/>
                <TextInput style={styles.inputBox} placeholder="Password" secureTextEntry={true}/>
            </View>
            
        );
    }
}
export default Login;