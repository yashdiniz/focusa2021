import React from 'react';
import { StatusBar,ScrollView, TouchableOpacity } from 'react-native';
import SearchBar from '../Components/SearchBar';
import styles from '../Styles/CourseStyles';
import Course from '../Components/Course';

import { ensureAuthenticated } from '../interface/ensureAuthenticated';

const Courses = ({ navigation, route, token }) =>{
    ensureAuthenticated(navigation, token);
    return(
        <ScrollView contentContainerStyle={styles.CoursesView}>
            <StatusBar backgroundColor = "#ffffff" barStyle="dark-content"/>
            <SearchBar/>

            <TouchableOpacity onPress={()=>navigation.navigate('SubjectPage')}>
                <Course/>
            </TouchableOpacity>
            
            <Course/>
            <Course/>
            <Course/>
            <Course/>
            <Course/>
        </ScrollView>
    )
}

export default Courses;