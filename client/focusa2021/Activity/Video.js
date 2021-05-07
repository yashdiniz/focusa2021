import React, {useState, useEffect, useRef} from 'react';
import {View,Text,StatusBar,Image,TouchableOpacity, TextInput} from 'react-native';
import styles from '../Styles/videostyles'
import {Overlay} from 'react-native-elements';


import {ensureAuthenticated} from '../interface/ensureAuthenticated';

const Video = ({ navigation, route, token }) =>{
    ensureAuthenticated(navigation, token);

    const [hostvisible, setVisibleHost] = useState(false);
    const [joinvisible, setVisibleJoin] = useState(false);

    const toggleOverlayHostMeeting = () => {
      setVisibleHost(!hostvisible);
    };

    const toggleOverlayJoinMeeting = () => {
        setVisibleJoin(!joinvisible);
      };

    return(
        <View style={styles.container}>
            <StatusBar backgroundColor = "#ffffff" barStyle="dark-content"/>
            <Image style={styles.image} source={require('../assets/images/focusa2.png')}/>
            <Image  style={styles.focusaText} source={require('../assets/images/focusalogosmall.png')} />

            <TouchableOpacity style={styles.ButtonStyles} onPress={toggleOverlayHostMeeting}>
                        <Text style={{fontSize: 20}}>Host Meeting</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.ButtonStyles} onPress={toggleOverlayJoinMeeting}>
                        <Text style={{fontSize: 20}}>Join Meeting</Text>
            </TouchableOpacity>

            <Overlay isVisible={hostvisible} onBackdropPress={toggleOverlayHostMeeting} >
                    <View style={styles.HostMeetingOverlayStyle}>
                        <Text style={{fontSize: 30, textAlign: 'center'}}>Create Space</Text>
                        <Text style={{alignSelf:'flex-start', paddingLeft: 30,marginTop: 20}}>space name:</Text>
                        <TextInput style={styles.inputBox}></TextInput>
                        <Text style={{alignSelf:'flex-start', paddingLeft: 30,marginTop: 20}}>space URL:</Text>
                        <TextInput style={styles.inputBox}></TextInput>

                        <View style={{flexDirection:"row", marginTop: 35}} >
                            <View style={{paddingRight: 30}}>
                                <TouchableOpacity style={styles.cancelButton}onPress={toggleOverlayHostMeeting}>
                                    <Text> Cancel</Text>
                                </TouchableOpacity>
                            </View>
                            
                            <View>
                                <TouchableOpacity style={styles.submitButton}>
                                    <Text> Submit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
            </Overlay>

            <Overlay isVisible={joinvisible} onBackdropPress={toggleOverlayJoinMeeting} >
                    <View style={styles.JoinMeetingOverlayStyle}>
                        <Text style={{fontSize: 30, textAlign: 'center'}}>Join Space</Text>
                        <Text style={{alignSelf:'flex-start', paddingLeft: 30,marginTop: 20}}>space code:</Text>
                        <TextInput style={styles.inputBox}></TextInput>

                        <View style={{flexDirection:"row", marginTop: 35}} >
                            <View style={{paddingRight: 30}}>
                                <TouchableOpacity style={styles.cancelButton} onPress={toggleOverlayJoinMeeting}>
                                    <Text> Cancel</Text>
                                </TouchableOpacity>
                            </View>
                            
                            <View>
                                <TouchableOpacity style={styles.submitButton} onPress={() => navigation.navigate('CameraTest')}>
                                    <Text> Submit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
            </Overlay>
            

        </View>
    )
}

export default Video;