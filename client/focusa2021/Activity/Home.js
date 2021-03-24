import React from 'react';
import { StatusBar, ScrollView } from 'react-native';
import styles from '../Styles/HomeStyle'
import Posts from '../Components/Post';
import SearchBar from '../Components/SearchBar';

import {ensureAuthenticated} from './ensureAuthenticated';

const Home = ({ navigation, route, token }) =>{
    ensureAuthenticated(navigation, token);
    return(
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
    );
}

export default Home;