import { useQuery } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Avatar, Card, Button } from 'react-native-elements';

import { connectProps } from '../hooks/store';
import { getCourses } from '../constants/queries';

function Courses({ navigation, route, token, username }) {
    const [refreshing, setRefreshing] = useState(false);

    const { data, error, loading, refetch } = useQuery(getCourses, {
        variables: {
            username: route.params?.username ?  // choose username parameters if provided
            route.params?.username
            : username            // otherwise use the redux prop
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
                    <Card.Title>{data?.user.profile.fullName}</Card.Title>
                    {/* <Text style={styles.profileText}>
                        @{data?.user.name}
                    </Text> */}
                    <Card.Divider />
                    <Text
                        style={{
                            ...styles.profileText,
                            marginBottom: 20,
                        }}
                    >{data?.user.profile.about}
                    </Text>
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
        margin: 20
    },
    profileText: {
        textAlign: 'center',
        color: '#789'
    }
});

export default connectProps(Courses);