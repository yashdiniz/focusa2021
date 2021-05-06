import React, { useState, useCallback } from 'react';
import { StatusBar, ScrollView, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
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

    const getLatest = (query, offset) => {
        let { data, error, loading } = useQuery(getPosts, {
            variables: { q: query, offset: offset },
        });
        // if (error) console.error(error);
        if (!loading) {
            console.log('getLatest', data.post);
        }
        
        return (
            loading ? (
                <ActivityIndicator color='#333' />
            ) : ( <FlatList data={data.post} renderItem={ ({ item }) => <Post data={item} /> } /> )
        )
    }

    ensureAuthenticated(navigation, token);
   const HomeView =()=>{
    if(!token){
        return<ErrorLogin navigation={navigation}/>
    }
    
    else{
        return(
            <ScrollView contentContainerStyle={styles.Homeview}
                refreshControl={
                    <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    />
                }>
                <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
                <SearchBar />
                {getLatest("hello", 0)}
            </ScrollView>
        )
      
    }
}
    
    // TODO: loading only 10 posts at a time to reduce lag.
    // need to automatically load posts of higher offsets as user scrolls down.
    return (
        HomeView()
    );
}

export default Home;