import { useLazyQuery } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
import { SearchBar, Tab } from 'react-native-elements';
import { connectProps } from '../hooks/store';
import { searchCourses, searchPosts } from '../constants/queries';
import Course from '../components/Course';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { CourseDetailsNavigate } from '../constants/screens';
import InfoMessage from '../components/InfoMessage';
import Post from '../components/Post';

function Search({ navigation, route, token, username }) {
    const [refreshing, setRefreshing] = useState(false);    // state updates when screen is refreshing
    const [tab, changeTab] = useState(0);   // state updates when user changes tabs on screen

    /**
     * Callback used to inform completion of refresh.
     */
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 500);
    });

    useEffect(() => {
        // if JWT is too short, it is usually because it is invalid.
        if (!token || token.length < 20) navigation.navigate('Login');
    });

    return (
        <SearchResults
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
            changeTab={changeTab}
            tab={tab}
            GQLQuery={
                tab == 0 ? searchCourses :
                    tab == 1 ? searchPosts : null
            }
            renderItem={
                ({ item }) =>
                    tab == 0 ?
                        (
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
                        ) :
                        tab == 1 ?
                            (
                                <Post
                                    parent={item.parent?.uuid}
                                    key={item.uuid}
                                    uuid={item.uuid}
                                    author={item.author.name}
                                    course={item.course.name}
                                    text={item.text}
                                    time={item.time}
                                    attachmentURL={item.attachmentURL}
                                    navigation={navigation}
                                />
                            )
                            : null
            }
        />
    );
}

function SearchResults({ refreshControl, GQLQuery, renderItem, tab, changeTab }) {
    const [search, updateSearch] = useState('');    // state updates when user types in search query

    const [execQuery, { error, data }] = useLazyQuery(GQLQuery);

    const execSearch = useCallback((query) => {
        updateSearch(query);
        execQuery({ variables: { query } });
    });

    useEffect(() => {
        if (error) {
            console.error(new Date(), 'Search', JSON.stringify(error));
        }
    });
    
    return (
        <FlatList
            containerStyle={styles.container}
            refreshControl={refreshControl}
            data={data?.results ? data.results : []}
            keyExtractor={
                item => item.uuid
            }
            ListHeaderComponent={
                <View>
                    <SearchBar
                        placeholder="Search"
                        onChangeText={execSearch}
                        value={search}
                        lightTheme
                        round
                        cancelIcon
                        clearIcon
                        inputContainerStyle={{ backgroundColor: 'white', height: 20, marginTop: 3 }}
                        containerStyle={{ backgroundColor: null, height: 60, marginBottom: 8, justifyContent: 'center' }}
                    />
                    <Tab
                        onChange={changeTab}
                        value={tab}
                        indicatorStyle={{backgroundColor:"red"}}
                    >
                        <Tab.Item title="Courses" containerStyle={{backgroundColor:null}} titleStyle={{color:'black'}}/>
                        <Tab.Item title="Posts"  containerStyle={{backgroundColor:null}} titleStyle={{color:'black'}}/>
                    </Tab>
                </View>

            }
            ListEmptyComponent={
                <InfoMessage
                    title={'No Search Results'}
                    message={'Try using different keywords for better results.'}
                />
            }
            renderItem={renderItem}
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
    },
});

export default connectProps(Search);