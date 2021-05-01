import React from 'react';
import { StatusBar, ScrollView, ActivityIndicator } from 'react-native';
import styles from '../Styles/HomeStyle'
import Post from '../Components/Post';
import SearchBar from '../Components/SearchBar';
import { useQuery, gql } from '@apollo/client';

const getPosts = gql`
    query getPosts($q: String, $offset: Int) {
        post(q:$q, offset:$offset){
            uuid, time, text, attachmentURL,
            author{ uuid, name },
            course{ uuid, name },
        }
    }
`;

import { ensureAuthenticated } from './ensureAuthenticated';

/**
 * 
 * @param {string} query 
 * @param {number} offset 
 */
const getLatest = (query, offset) => {
    const { data, error, loading } = useQuery(getPosts, {
        variables: { q: query, offset: offset },
    });
    console.log(data);
    if (error) console.error(error);
    let posts = data.map(o =>
        <Post uuid={data.uuid} time={data.time}
            text={data.text} author={data.author}
            course={data.course} attachmentURL={data.attachmentURL}
        />
    );

    return (
        loading ? (
            <ActivityIndicator color='#333' />
        ) : (
            posts
        )
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
            {/* {getLatest("*", 0)} */}
            <Post/>
            <Post/>
            <Post/>
            <Post/>
            <Post/>
            <Post/>
            <Post/>
            <Post/>
            <Post/>
            <Post/>
        </ScrollView>
    );
}

export default Home;