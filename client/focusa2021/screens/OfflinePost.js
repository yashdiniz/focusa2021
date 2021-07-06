import React, { useState, useCallback, useEffect } from 'react';
import { Text, RefreshControl, StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Post from '../components/Post';
import { getAllPosts } from '../database/post';

export default function OfflinePost() {
    let posts = getAllPosts();
    const [refreshing, setRefreshing] = useState(false);

    /**
     * Callback used to inform completion of refresh.
     */
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // refresh will cause refetching of the query
        // once refetched, it will cause a re-render.
        setRefreshing(false);
    });

    return (
        <FlatList
            containerStyle={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
            data={posts}
            keyExtractor={item => item.uuid}
            renderItem={
                ({item}) => 
                    <Post
                        uuid={item.uuid}
                        text={item.text}
                        course={item.course}
                        time={item.time}
                        author={item.author}
                        attachmentURL={item.attachmentURL}
                    />
            }
        />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
})