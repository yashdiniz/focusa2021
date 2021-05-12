import { useQuery } from '@apollo/client';
import React from 'react';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import { getProfileData } from '../queries';

export default function Profile({ navigation, route }) {
    const { data, error, loading } = useQuery(getProfileData, {
        variables: { username: "admin" }   // TODO: Username currently hardcoded lol
    });

    if (error) {
        navigation.navigate('Login');
        console.error('Profile', JSON.stringify(error));
    }
    if (data) console.log('Profile', data);

    if (loading) 
        return (
            <View style={styles}>
                <ActivityIndicator color={'#333'} />
            </View>
        );
    else 
        return (
            <View style={styles}>
                <Text>{JSON.stringify(data)}</Text>
                <Text style={{
                    color:'red'
                }}>{'Did it work?'}</Text>
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