import { useQuery } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { graphQLToken } from '../hooks/apollo';
import { getProfileData } from '../queries';

export default function Profile({ navigation, route }) {
    const [refreshing, setRefreshing] = useState(false);

    const { data, error, loading, refetch } = useQuery(getProfileData, {
        variables: { username: "admin" }   // TODO: Username currently hardcoded lol
    });

    /**
     * Callback used to inform completion of refresh.
     */
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        console.log('Refreshing');
        // refresh will cause refetching of the query
        // once refetched, it will cause a re-render.
        refetch({
            variables: { username: "admin" }
        }).then(() => setRefreshing(false))
        .catch(e => console.error('Profile Refresh', e));
    });

    useEffect(() => {
        // if JWT is too short, it is usually because it is invalid.
        if(graphQLToken().length < 20) navigation.navigate('Login');
        if (error) {
            console.error('Profile', JSON.stringify(error));
        }
        if (data) console.log('Profile', data);
    }, ['refreshing']);

    if (loading) 
        return (
            <View style={styles}>
                <ActivityIndicator color={'#333'} />
            </View>
        );
    else 
        return (
            <ScrollView style={styles}
                refreshControl={
                    <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    />
                }
                >
                <Text>{JSON.stringify(data)}</Text>
                <Text style={{
                    color:'red'
                }}>{'Did it work?'}</Text>
            </ScrollView>
        );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});