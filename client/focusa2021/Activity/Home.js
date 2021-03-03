import React, {Component} from 'react';
import { View, StatusBar, Text,ScrollView,SafeAreaView, TextInput } from 'react-native';
import styles from '../Styles/HomeStyle'
import Posts from '../Components/Post';
import { isLoggedIn } from './singletonStates';
import SearchBar from '../Components/SearchBar';


const Home = ({ navigation, route }) =>{
    if(!isLoggedIn()) navigation.navigate('Login');
    return(
        <SafeAreaView>
            <ScrollView contentContainerStyle={styles.Homeview}>
            <StatusBar backgroundColor = "#ffffff" barStyle="dark-content"/>
            <SearchBar/>
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