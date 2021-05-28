import { useQuery } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Avatar, Card, Button, SearchBar } from 'react-native-elements';
import { connectProps } from '../hooks/store';
import { getCourses } from '../constants/queries';
import Course from '../components/Course';
import ErrorComponent from '../components/ErrorComponent';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { CourseDetails } from '../constants/screens';
import InfoMessage from '../components/InfoMessage';

function Settings({ navigation, route, token, username }) {
    // TODO: Allow users to search for courses from here!
    username = route.params?.username ?  // choose username parameters if provided
        route.params?.username
        : username;            // otherwise use the redux prop

    const [refreshing, setRefreshing] = useState(false);
    const [search, updateSearch] = useState('');

    const { data, error, loading, refetch } = useQuery(getCourses, {
        variables: {
            username
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
                console.error(new Date(), 'Courses Refresh', e);
            });
    });

    useEffect(() => {
        // if JWT is too short, it is usually because it is invalid.
        if (!token || token.length < 20) navigation.navigate('Login');
        if (error) {
            console.error(new Date(), 'Courses', JSON.stringify(error));
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
            <Text>This is the settings page</Text>
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

export default connectProps(Settings);