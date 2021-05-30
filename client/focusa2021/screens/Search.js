import { useLazyQuery } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react';
import {  View, StyleSheet, RefreshControl } from 'react-native';
import {SearchBar, Tab } from 'react-native-elements';
import { connectProps } from '../hooks/store';
import { searchCourses } from '../constants/queries';
import Course from '../components/Course';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { CourseDetailsNavigate } from '../constants/screens';
import InfoMessage from '../components/InfoMessage';

function Search({ navigation, route, token, username }) {
    const [refreshing, setRefreshing] = useState(false);
    const [search, updateSearch] = useState('');

    const [execQuery, { error, data }] = useLazyQuery(searchCourses);

    /**
     * Callback used to inform completion of refresh.
     */
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 500);
    });

    const execSearch = useCallback((query) => {
        updateSearch(query);
        execQuery({ variables: { query } });
    })

    useEffect(() => {
        // if JWT is too short, it is usually because it is invalid.
        if (!token || token.length < 20) navigation.navigate('Login');
        if (error) {
            console.error(new Date(), 'Search', JSON.stringify(error));
        }
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
            data={data?.courses ? data.courses : []}
            keyExtractor={
                item => item.uuid
            }
            ListHeaderComponent={
                <View>
                    <SearchBar
                        placeholder="Search for courses"
                        onChangeText={execSearch}
                        value={search}
                        lightTheme
                        round
                        cancelIcon
                        clearIcon
                        inputContainerStyle={{ backgroundColor: 'white', height: 20, marginTop: 3 }}
                        containerStyle={{ backgroundColor: null, height: 60, marginBottom: 8, justifyContent: 'center' }}
                    />

                    <Tab>
                        <Tab.Item title="Post" />
                        <Tab.Item title="Users" />
                        <Tab.Item title="Courses" />
                    </Tab>
                </View>

            }
            ListEmptyComponent={
                <InfoMessage
                    title={'No Matching Courses'}
                    message={'Use the search bar and search for courses!'}
                />
            }
            renderItem={
                ({ item }) =>
                    <TouchableOpacity
                        key={item.uuid}
                        onPress={() => navigation.navigate('CourseDetails', {
                            ...CourseDetailsNavigate,
                            params: { courseID: item.uuid }
                        })
                        }
                    >
                        <Course
                            name={item.name}
                            description={item.description}
                        />
                    </TouchableOpacity>
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

export default connectProps(Search);