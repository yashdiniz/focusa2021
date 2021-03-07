import React, { useState, Component } from 'react';
import { ScrollView,Text,StatusBar,Image, TextInput, Button, Alert, TouchableOpacity} from 'react-native';
import styles from '../Styles/LoginStyles';
import * as Font from 'expo-font';
import { ScalarLeafsRule } from 'graphql';
import { set } from 'react-native-reanimated';

import { authenticate } from "./ensureAuthenticated";

const Login=({navigation, setLoggedIn}) =>{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    let passwordTextInput;

    function presslogin(){
        if(username == '' || password == ''){
            Alert.alert('Message:','username and pasword can\'t be empty')
        }
        else{
            Alert.alert('Logging in', username + password);
            // TODO: disable manual back button
            // refer https://stackoverflow.com/a/43980393
            authenticate(username, password, setLoggedIn)   // perform authentication
            .then(() => navigation.goBack())  // go back to activity on success
            .catch(console.error);  // TODO: toast on failure
        }
    }

    function forgotpassword(){
        Alert.alert( 'Forgot your password');
    }

    return(
        <ScrollView contentContainerStyle={styles.container}>
                <StatusBar backgroundColor = "#ffffff" barStyle="dark-content"/> 
                <Image style={styles.image} source={require('../assets/images/focusa2.png')}/>
                <Image  style={styles.focusaText} source={require('../assets/images/focusalogosmall.png')} />
                <TextInput style={styles.inputBox} placeholder="Username" require={true}
                    returnKeyType='next' autoFocus={true} autoCapitalize='none' autoCorrect={false} 
                    onChangeText={(username) => setUsername(username)} 
                    onSubmitEditing={() => { passwordTextInput.focus(); }}/>
                <TextInput style={styles.inputBox} placeholder="Password" 
                    secureTextEntry={true} returnKeyType='done' 
                    onChangeText={(password) => setPassword(password)} 
                    onSubmitEditing={presslogin} 
                    ref={(input)=> { passwordTextInput = input; }}/>

                <TouchableOpacity 
                style ={{
                    height: 40,
                    width:160,
                    borderRadius: 17,
                    marginTop :20,
                }} returnKeyType='next'>
            <Button title="LOGIN" color="black" onPress={presslogin}/> 
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotpassword} onPress={forgotpassword}>
                <Text>
                    Forgot Password?
                </Text>
        </TouchableOpacity>
            </ScrollView>
    );

}

export default Login;