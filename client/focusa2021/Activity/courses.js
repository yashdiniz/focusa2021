import React, {useEffect} from 'react';
import { View, Text, StatusBar,ScrollView } from 'react-native';
import { isLoggedIn } from './singletonStates'; 
import SearchBar from '../Components/SearchBar';
import styles from '../Styles/CourseStyles';
import Course from '../Components/Course';

const Courses = ({ navigation, route, login }) =>{
    useEffect(() => { if(!login) navigation.navigate('Login');});
    return(
        <ScrollView contentContainerStyle={styles.CoursesView}>
            <StatusBar backgroundColor = "#ffffff" barStyle="dark-content"/>
            <SearchBar/>
            <Course/>
            <Course/>
            <Course/>
            <Course/>
            <Course/>
            <Course/>
        </ScrollView>
    )
}

export default Courses;