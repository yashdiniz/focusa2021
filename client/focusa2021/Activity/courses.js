import React,{useState,useCallback} from 'react';
import { StatusBar,ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import SearchBar from '../Components/SearchBar';
import styles from '../Styles/CourseStyles';
import Course from '../Components/Course';
import ErrorLogin from '../Components/ErrorLogin'
import { ensureAuthenticated } from '../interface/ensureAuthenticated';

const Courses = ({ navigation, route, token }) =>{

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);

    ensureAuthenticated(navigation, token);
    return(

        <ScrollView contentContainerStyle={styles.CoursesView}
        refreshControl={
            <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            />
        }>
            <StatusBar backgroundColor = "#ffffff" barStyle="dark-content"/>
            <SearchBar/>

            {token ?(
            <TouchableOpacity onPress={()=>navigation.navigate('SubjectPage')}>
                <Course/>
            </TouchableOpacity>):(<ErrorLogin navigation={navigation}/>)}


        </ScrollView>
    )
}

export default Courses;