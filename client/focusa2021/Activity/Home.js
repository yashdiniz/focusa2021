import React, { useState, useCallback } from 'react';
import { StatusBar, ScrollView, ActivityIndicator, FlatList, RefreshControl, View, Text } from 'react-native';
import styles from '../Styles/HomeStyle'
import Post from '../Components/Post';
import SearchBar from '../Components/SearchBar';
import { useQuery } from '@apollo/client';
import { getPosts } from '../interface/queries';

import { ensureAuthenticated, wait } from '../interface/ensureAuthenticated';

import ErrorLogin from '../Components/ErrorLogin';

const Home = ({ navigation, route, token }) => {

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);

    let { data, error, loading } = useQuery(getPosts, {
        variables: { q: "hello", offset: 0 },
    });

    if(error) console.error(error);

    ensureAuthenticated(navigation, token);

    // TODO: loading only 10 posts at a time to reduce lag.
    // need to automatically load posts of higher offsets as user scrolls down.
    return (
        <ScrollView contentContainerStyle={styles.Homeview}
            refreshControl={
                <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                />
            }>
            <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
            <SearchBar/>
            {   token ? (
                    loading ? (
                        <ActivityIndicator color='#333' />
                    ) : ( <FlatList data={data.post} renderItem={ ({ item }) => <Post data={item} /> } /> )
                ) : (<ErrorLogin navigation={navigation}/>)}
        </ScrollView>
    );
}

export default Home;