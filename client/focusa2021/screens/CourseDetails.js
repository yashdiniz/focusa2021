import { useQuery } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Avatar, Card, Button, SearchBar } from 'react-native-elements';
import { connectProps } from '../hooks/store';
import { getCourseDetails } from '../constants/queries';
import Course from '../components/Course';
import Post from '../components/Post';
import { FlatList } from 'react-native-gesture-handler';
import ErrorComponent from '../components/ErrorComponent';

function CourseDetails({ navigation, route, token }) {
    // TODO: allow users to subscribe to courses from here!
    const [refreshing, setRefreshing] = useState(false);

    const { data, error, loading, refetch } = useQuery(getCourseDetails, {
        variables: {
            courseID: route.params.courseID,
        },
    });

    /**
     * Callback used to inform completion of refresh.
     */
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // refresh will cause refetching of the query
        // once refetched, it will cause a re-render.
        refetch().then(() => setRefreshing(false))
            .catch(e => {
                setRefreshing(false);
                console.error(new Date(), 'CourseDetails Refresh', e);
            });
    });

    useEffect(() => {
        // if JWT is too short, it is usually because it is invalid.
        if (!token || token.length < 20) navigation.navigate('Login');
        if (error) {
            console.error(new Date(), 'CourseDetails', JSON.stringify(error));
        }
    });

    if (loading)
        return (
            <View style={styles.container}>
                <ActivityIndicator color={'#333'} />
            </View>
        );
    else if (error)
        return (<ErrorComponent error={error} />);
    else
        return (
            <FlatList
                refreshing={refreshing}
                onRefresh={onRefresh}
                ListHeaderComponent={
                    <Course
                        name={data.course.name}
                        description={data.course.description}
                    />
                }
                data={data.course.posts}
                renderItem={
                    ({ item }) =>
                        <Post
                            author={item.author.name}
                            course={item.course.name}
                            text={item.text}
                            time={item.time}
                            attachmentURL={item.attachmentURL}
                        />
                }
            />
        );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        flex: 2,
        backgroundColor: '#333',
        margin: 20
    },
    profileText: {
        textAlign: 'center',
        color: '#789'
    }
});

export default connectProps(CourseDetails);