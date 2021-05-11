import { useQuery } from '@apollo/client';
import React from 'react';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import { getProfileData } from '../queries';

export default function Profile({ navigation, route }) {
    const { data, error, loading } = useQuery(getProfileData, {
        username: "admin"   // TODO: Username currently hardcoded lol
    });

    if (loading) 
        return <ActivityIndicator />;
    else 
        return (
            <View style={styles}>
                <Text>{data}</Text>
                <Text style={{
                    color:'red'
                }}>{error}</Text>
            </View>
        );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});