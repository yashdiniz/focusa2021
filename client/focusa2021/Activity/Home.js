import React from 'react';
import { StatusBar, ScrollView, ActivityIndicator, FlatList, } from 'react-native';
import styles from '../Styles/HomeStyle'
import Post from '../Components/Post';
import SearchBar from '../Components/SearchBar';
import { useQuery} from '@apollo/client';
import { getPosts } from '../interface/queries';

import { ensureAuthenticated } from '../interface/ensureAuthenticated';

/**
 * 
 * @param {string} query 
 * @param {number} offset 
 */
const getLatest = (query, offset) => {
    let { data, error, loading } = useQuery(getPosts, {
        variables: { q: query, offset: offset },
    });

    if (error) console.error(error);
    else if (!loading) {
        console.log('getLatest', data);
    }
    
    return (
        loading ? (
            <ActivityIndicator color='#333' />
        ) : ( <FlatList data={data?.post} renderItem={ item => <Post data={item} /> } /> )
    )
}

const Home = ({ navigation, route, token }) => {
    ensureAuthenticated(navigation, token);

    // TODO: loading only 10 posts at a time to reduce lag.
    // need to automatically load posts of higher offsets as user scrolls down.
    return (
        <ScrollView contentContainerStyle={styles.Homeview}>
            <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
            <SearchBar />
            {getLatest("hello", 0)}
        </ScrollView>
    );
}

export default Home;