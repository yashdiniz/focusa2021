import React, {useEffect} from 'react';
import { View, StatusBar, Text,ScrollView,SafeAreaView, TextInput } from 'react-native';
import styles from '../Styles/HomeStyle'
import Posts from '../Components/Post';
import SearchBar from '../Components/SearchBar';


const Home = ({ navigation, route, login }) =>{
    useEffect(() => { if(!login) navigation.navigate('Login');});
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