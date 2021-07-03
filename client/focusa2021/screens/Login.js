import { authenticate } from '../hooks/authenticate';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, ScrollView, View, StatusBar, Image, TextInput, Button, TouchableOpacity, ToastAndroid } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Login({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [viewPassword, setVisiblePassword] = useState(true);
    let passwordTextInput;  // a variable reference to password text input

    const toggleViewPassword = () => {
        setVisiblePassword(!viewPassword);
    }

    function presslogin() {
        if (username.trim().length == 0 || password == '') {
            ToastAndroid.showWithGravityAndOffset(
                "Username and Password cannot be empty!",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );
        }
        else {
            setLoading(true);
            // NOTE: DO NOT disable manual back button (refer https://stackoverflow.com/a/43980393)
            return authenticate(username, password)   // perform authentication
                .then(() => {
                    setLoading(false);
                    navigation.goBack();    // go back to activity on success
                })
                .catch((err) => {
                    setLoading(false);
                    console.error(err);
                    ToastAndroid.showWithGravityAndOffset(
                        "Login failed, please try again.",
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        25,
                        50
                    );
                });
        }
    }

    if(loading) 
        return (
            <View style={styles.container}>
                <ActivityIndicator color={'#333'} />
            </View>
        );
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
            <Image style={styles.image} source={require('../assets/images/focusa2.png')} />
            <Image style={styles.focusaText} source={require('../assets/images/focusalogosmall.png')} />
            
            <TextInput style={styles.inputBox} placeholder="Username" require={true}
                returnKeyType='next' autoFocus={true} autoCapitalize='none' autoCorrect={false}
                onChangeText={(x) => setUsername(x)}
                onSubmitEditing={() => { passwordTextInput.focus(); }} />

            <View style={styles.PasswordInputBox}>
            <TextInput style={{ width: 180 }} placeholder="Password"
                    secureTextEntry={viewPassword} returnKeyType='done'
                    onChangeText={(x) => setPassword(x)}
                    onSubmitEditing={presslogin}
                    ref={(input) => { passwordTextInput = input; }} />

                <TouchableOpacity onPress={toggleViewPassword}>
                    <MaterialCommunityIcons name='eye' size={20} style={{ paddingStart: 27, paddingTop: 7 }} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={{
                    height: 40,
                    width: 160,
                    borderRadius: 17,
                    marginTop: 20,
                }} returnKeyType='next'>
                <Button title="LOGIN" color="black" onPress={presslogin} />
            </TouchableOpacity>
        </ScrollView>
    );

}

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'white',
        alignItems: "center",
        justifyContent: "center",
        height: '100%', // Dimensions.get('screen').height,
        width: '100%', // Dimensions.get('screen').width,
    },

    image:{
        marginTop: 10,
        width: 60,
        height: 200,
    },
    focusaText:{
        marginTop: 20,
        width: 170,
        height: 32,
    },

    inputBox:{
        height: 40,
        width: 250,
        borderColor: 'gray',
        borderWidth: 2,
        marginTop: 30,
        padding: 10,
        borderRadius: 17,
    },

    PasswordInputBox:{
        flexDirection: 'row',
        height: 40,
        width: 250,
        color: 'black',
        borderColor:'gray',
        borderWidth: 2,
        marginTop: 30,
        paddingStart: 10,
        borderRadius: 17
    },
    submitButton:{
        marginTop:20,
        alignItems: "center",
        justifyContent:"center",
        borderWidth:1,
        borderColor:"black",
        backgroundColor:"black",
        width: 90,
        height:30,
        borderRadius: 15,
    },
});
