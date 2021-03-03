import React, {Component} from 'react';
import { View, StatusBar, Text,ScrollView,SafeAreaView } from 'react-native';
import styles from '../Styles/HomeStyle'
import Posts from '../Components/Post';
import { isLoggedIn } from './singletonStates';
import Login from '../Activity/Login';

const Home = ({ navigation, route }) =>{
    if(!isLoggedIn()) navigation.navigate('Login');
    return(
        <SafeAreaView>
            <ScrollView contentContainerStyle={styles.Homeview}>
            <StatusBar backgroundColor = "#ffffff" barStyle="dark-content"/>
            <Posts/>
            <Posts/>
            <Posts/>
            <Posts/>
            <Posts/>
            <Posts/>
            <Posts/>
        </ScrollView>

        </SafeAreaView>

    );
}

export default Home;