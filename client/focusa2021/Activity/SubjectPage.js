import React from 'react';
import { View,StatusBar, ScrollView } from 'react-native';
import styles from '../Styles/SubjectPageStyle';

const SubjectPage  = ()=>{
    return(
        <ScrollView contentContainerStyle={styles.SujectPageView}>
            <StatusBar backgroundColor = "#ffffff" barStyle="dark-content"/>
        </ScrollView>
    );
}

export default SubjectPage;