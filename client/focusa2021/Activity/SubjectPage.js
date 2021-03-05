import React, {useEffect} from 'react';
import { View,StatusBar, ScrollView } from 'react-native';
import styles from '../Styles/SubjectPageStyle';

const SubjectPage  = ({navigation, route, login})=>{
    useEffect(() => { if(!login) navigation.navigate('Login');});
    return(
        <ScrollView contentContainerStyle={styles.SujectPageView}>
            <StatusBar backgroundColor = "#ffffff" barStyle="dark-content"/>
        </ScrollView>
    );
}

export default SubjectPage;