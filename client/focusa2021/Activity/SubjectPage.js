import React, {useEffect} from 'react';
import { View,StatusBar, ScrollView } from 'react-native';
import styles from '../Styles/SubjectPageStyle';

import {ensureAuthenticated} from './ensureAuthenticated';

const SubjectPage  = ({navigation, route, login})=>{
    ensureAuthenticated(navigation, login);
    return(
        <ScrollView contentContainerStyle={styles.SujectPageView}>
            <StatusBar backgroundColor = "#ffffff" barStyle="dark-content"/>
        </ScrollView>
    );
}

export default SubjectPage;