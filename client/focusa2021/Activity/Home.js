import React, {Component} from 'react';
import { View, StatusBar, Text } from 'react-native';
import styles from '../Styles/HomeStyle'

const Home = ({ navigation, route }) =>{
    return(
        <View style={styles.view}>
            <StatusBar backgroundColor = "#000000" barStyle="light-content"/>
            <Text>Hello {route.params.username}.</Text>
        </View>
    );
}

export default Home;