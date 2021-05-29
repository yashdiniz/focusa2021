import { useQuery } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View, StyleSheet, ScrollView, RefreshControl,Dimensions } from 'react-native';
import { Avatar, Card, Button, SearchBar } from 'react-native-elements';
import { connectProps } from '../hooks/store';
import { getCourses } from '../constants/queries';
import Course from '../components/Course';
import ErrorComponent from '../components/ErrorComponent';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { CourseDetailsNavigate } from '../constants/screens';
import InfoMessage from '../components/InfoMessage';

function Courses({ navigation, route, token, username }) {
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
            <FlatList
                containerStyle={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                data={data?.user.profile.interests}
                keyExtractor={
                    item => item.uuid
                }
                ListHeaderComponent={
                    <View>
                        <SearchBar
                            placeholder="search"
                            onChangeText={updateSearch}
                            value={search}
                            lightTheme
                            round
                            cancelIcon
                            clearIcon
                            inputContainerStyle={{ backgroundColor: 'white', height: 20, marginTop: 3 }}
                            containerStyle={{ backgroundColor: null, height: 60, marginBottom: 8, justifyContent: 'center' }}
                        />
                        <View style={{
                            borderRightColor:"red",
                            borderRightWidth:3,
                            borderTopColor:"red",
                            borderTopWidth:3,
                            width: Dimensions.get('screen').width - 15,
                            height: 20,
                            borderTopRightRadius:10,
                            marginBottom:5,
                            marginTop: 10,
                            alignItems:'center',
                        }}>
                            <Text style={{
                                fontWeight:"bold",
                                fontSize:18,
                            }}>Subscribed Courses</Text>

                        </View>
                    </View>

                }
                ListEmptyComponent={
                    <InfoMessage
                        title={'No Subscribed Courses'}
                        message={'Use the search bar to subscribe to new courses!'}
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

export default connectProps(Courses);