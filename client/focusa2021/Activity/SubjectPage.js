import React from 'react';
import { StatusBar, ScrollView } from 'react-native';
import styles from '../Styles/SubjectPageStyle';
import SubjectPageHeader from '../Components/SujectPageHeader';
import Post from '../Components/Post';

import { ensureAuthenticated } from '../interface/ensureAuthenticated';

const SubjectPage = ({ navigation, route }) => {
    ensureAuthenticated(navigation);
    return (
        <ScrollView contentContainerStyle={styles.SujectPageView}>
            <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
            <SubjectPageHeader />
            <Post />
            <Post />
            <Post />
            <Post />
            <Post />

        </ScrollView>
    );
}

export default SubjectPage;