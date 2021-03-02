import React, {Component} from 'react';
import { View, StatusBar, Text } from 'react-native';
import styles from '../Styles/HomeStyle'
import Posts from '../Components/Post';

const Home = ({ navigation, route }) =>{
    return(
        <View style={styles.Homeview}>
            <StatusBar backgroundColor = "#ffffff" barStyle="dark-content"/>
            <Posts/>
        </View>
    );
}

export default Home;