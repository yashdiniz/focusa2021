import { useQuery } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet, TouchableOpacity, RefreshControl, FlatList, Dimensions } from 'react-native';
import { Avatar, Card, Button, Text } from 'react-native-elements';

import { connectProps } from '../hooks/store';
import { getProfileData } from '../constants/queries';
import ErrorComponent from '../components/ErrorComponent';
import InfoMessage from '../components/InfoMessage';
import { CoursesNavigate, CourseDetailsNavigate } from '../constants/screens';
import Course from '../components/Course';

function Profile({ navigation, route, token, username }) {
    // TODO: Add a settings component which allows the user to edit various preferences.
    username = route.params?.username ?  // choose username parameters if provided
        route.params?.username
        : username;            // otherwise use the redux prop

    const [refreshing, setRefreshing] = useState(false);

    const { data, error, loading, refetch } = useQuery(getProfileData, {
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
                console.error(new Date(), 'Profile Refresh', e);
            });
    });

    useEffect(() => {
        // if JWT is too short, it is usually because it is invalid.
        if (!token || token.length < 20) navigation.navigate('Login');
        if (error) {
            console.error(new Date(), 'Profile', JSON.stringify(error));
        }
    });

    if (loading)
        return (
            <View style={styles.container}>
                <ActivityIndicator color={'#333'} />
            </View>
        );
    if (error)
        return (<ErrorComponent error={error} />);

    return (
        <FlatList
            containerStyle={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
            data={data.user.profile.interests}
            keyExtractor={
                item => item.uuid
            }
            ListHeaderComponent={
                <View>
                    <Card containerStyle={{ margin: 0, marginBottom: 20 }}>
                        <Avatar
                            rounded
                            size="large"
                            icon={{ name: 'user', type: 'font-awesome' }}
                            activeOpacity={0.7}
                            containerStyle={styles.avatar}
                        />
                        <Card.Title>
                            {data?.user.profile.fullName} (@{data.user.name})
                        </Card.Title>
                        <Card.Divider />
                        <Text
                            style={{
                                ...styles.profileText,
                                marginBottom: 40,
                            }}
                        >{data?.user.profile.about}
                        </Text>
                        {/* TODO: Update this button to point to the new screen... Remember to pass as params! */}
                        <Button
                            title={'Subscribed Courses'}
                            onPress={() => navigation.navigate('Courses', {
                                ...CoursesNavigate,
                                params: { username }
                            })
                            }
                        />
                    </Card>
                    <View style={{
                        width: Dimensions.get('screen').width,
                        height: 50,
                        borderTopWidth: 2,
                        borderBottomWidth: 2,
                        borderTopColor: 'red',
                        borderBottomColor: 'red',
                        alignItems: 'center',
                        justifyContent: 'center'

                    }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Subscribed Courses</Text>
                    </View>
                </View>
            }
            ListEmptyComponent={
                <InfoMessage
                    title={'No Subscribed Courses'}
                    message={'Subscribe to courses and get the latest updates!'}
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
        marginBottom: 30,
    },
    avatar: {
        flex: 2,
        backgroundColor: '#333',
        margin: 20,
        alignSelf: "center"
    },
    profileText: {
        textAlign: 'center',
        color: '#789'
    }
});

export default connectProps(Profile);