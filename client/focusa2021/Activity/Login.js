import React, { useState} from 'react';
import { View } from 'react-native';
import { ScrollView,Text,StatusBar,Image, TextInput, Button, Alert, TouchableOpacity, ToastAndroid} from 'react-native';
import { Overlay } from 'react-native-elements';
import styles from '../Styles/LoginStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { authenticate } from "../interface/ensureAuthenticated";

const Login=({navigation, token, setLoggedIn}) =>{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [forgotPassword, setVisdibleForgotPassword]= useState(false)
    let passwordTextInput;

    const toggleForgotPassword =()=>{
        setVisdibleForgotPassword(!forgotPassword);
    }
    const [viewPassword, setVisiblePassword] = useState(true)
    const toggleViewPassword =() =>{
        setVisiblePassword(!viewPassword);
    }

    function presslogin() {
        if(username.trim().length == 0 || password == ''){
            ToastAndroid.showWithGravityAndOffset(
                "Username and Password cannot be empty!",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
              );
        }
        else{
            //Alert.alert('Logging in', username + password);
            // TODO: disable manual back button
            // refer https://stackoverflow.com/a/43980393
            return authenticate(username, password, setLoggedIn)   // perform authentication
            .then(() => navigation.goBack())  // go back to activity on success
            .catch(console.error);  // TODO: toast on failure
        }
    }

    return(
        <ScrollView contentContainerStyle={styles.container}>
                <StatusBar backgroundColor = "#ffffff" barStyle="dark-content"/> 
                <Image style={styles.image} source={require('../assets/images/focusa2.png')}/>
                <Image  style={styles.focusaText} source={require('../assets/images/focusalogosmall.png')} />
                <TextInput style={styles.inputBox}  placeholder="Username" require={true}
                    returnKeyType='next' autoFocus={true} autoCapitalize='none' autoCorrect={false} 
                    onChangeText={(x) => setUsername(x)}
                    onSubmitEditing={() => { passwordTextInput.focus(); }}/>
                
                    <View style={styles.PasswordInputBox}>
                        <TextInput style={{width: 180}} placeholder="Password" 
                        secureTextEntry={viewPassword} returnKeyType='done' 
                        onChangeText={(x) => setPassword(x)} 
                        onSubmitEditing={presslogin} 
                        ref={(input)=> { passwordTextInput = input; }}/>

                        <TouchableOpacity onPress={toggleViewPassword}>
                            <MaterialCommunityIcons name='eye' size={20} style={{ paddingLeft: 27}} />
                        </TouchableOpacity>
                    </View>

                <TouchableOpacity 
                style ={{
                    height: 40,
                    width:160,
                    borderRadius: 17,
                    marginTop :20,
                }} returnKeyType='next'>
            <Button title="LOGIN" color="black" onPress={presslogin}/> 
          </TouchableOpacity>

          <Overlay isVisible={forgotPassword} onBackdropPress={toggleForgotPassword}>
              <View style={styles.forgotPasswordOverlayStyle}>
                  <Text style={{padding:10, fontSize:13, fontWeight:'bold'}}>Please enter your registered Email. A password reset link will be sent to your registered Email.</Text>
                  <TextInput style={styles.inputBox} placeholder='Email'/>

            <TouchableOpacity style={styles.submitButton}>
                <Text style={{color:'white'}}> Submit</Text>
            </TouchableOpacity>
              </View>
          </Overlay>

          <TouchableOpacity style={styles.forgotpassword} onPress={toggleForgotPassword}>
                <Text style={{color:'black'}}>Forgot Password?</Text>
        </TouchableOpacity>
            </ScrollView>
    );

}

export default Login;