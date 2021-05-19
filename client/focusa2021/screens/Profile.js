import { useQuery } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Avatar, Card, Button, Text } from 'react-native-elements';

import { connectProps } from '../hooks/store';
import { getProfileData } from '../constants/queries';
import ErrorComponent from '../components/ErrorComponent';
import { Courses } from '../constants/screens';

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
    else if (error)
        return (<ErrorComponent error={error} />);
    else
        return (
            <ScrollView containerStyle={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <Card>
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
                    {/* <Text style={{ textAlign: 'center' }}>
                        About
                    </Text> */}
                    <Text
                        style={{
                            ...styles.profileText,
                            marginBottom: 40,
                        }}
                    >{data?.user.profile.about}
                    </Text>
                    <Button 
                        title={'Subscribed Courses'}
                        onPress={() => navigation.navigate('Courses', { 
                                ...Courses,
                                params: { username } 
                            })
                        }
                    />
                </Card>
            </ScrollView>
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
        margin: 20,
        alignSelf: "center"
    },
    profileText: {
        textAlign: 'center',
        color: '#789'
    }
});

export default connectProps(Profile);