import React, {Component} from 'react';
import { View, StatusBar, Text } from 'react-native';
import styles from '../Styles/HomeStyle'
import Posts from '../Components/Post';
import { isLoggedIn } from './singletonStates';
import Login from '../Activity/Login';

const Home = ({ navigation, route }) =>{
    if(!isLoggedIn()) navigation.navigate('Login');
    return(
        <View style={styles.Homeview}>
            <StatusBar backgroundColor = "#ffffff" barStyle="dark-content"/>
            <Posts/>
        </View>
    );
}

export default Home;