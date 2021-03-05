import React, {useEffect} from 'react';
import { View, Text, StatusBar,ScrollView } from 'react-native';
import { isLoggedIn } from './singletonStates'; 
import SearchBar from '../Components/SearchBar';
import styles from '../Styles/CourseStyles';
import Course from '../Components/Course';

import { ensureAuthenticated } from './ensureAuthenticated';

const Courses = ({ navigation, route, login }) =>{
    ensureAuthenticated(navigation, login);
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