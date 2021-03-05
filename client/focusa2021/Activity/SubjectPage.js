import React from 'react';
import { View,StatusBar, ScrollView } from 'react-native';
import styles from '../Styles/SubjectPageStyle';
import SubjectPageHeader from '../Components/SujectPageHeader'; 
import Post from '../Components/Post';

import {ensureAuthenticated} from './ensureAuthenticated';
import Posts from '../Components/Post';

const SubjectPage  = ({navigation, route, login})=>{
    ensureAuthenticated(navigation, login);
    return(
        <ScrollView contentContainerStyle={styles.SujectPageView}>
            <StatusBar backgroundColor = "#ffffff" barStyle="dark-content"/>
            <SubjectPageHeader/>
            <Post/>
            <Post/>
            <Post/>
            <Post/>
            <Post/>

        </ScrollView>
    );
}

export default SubjectPage;