import React from 'react';
import { ActivityIndicator, View, StyleSheet, Button } from 'react-native';
import { authenticate } from '../hooks/authenticate';

export default function Login({ navigation, route }) {
    const loggedIn = authenticate('admin','gyroscope')  // TODO: REMOVE THIS LINE ASAP!!

    if (loggedIn)
        return (
            <View style={styles}>
                <Button 
                    title={'Logged In. Press to continue.'}
                    onPress={() => navigation.goBack()}
                />
            </View>
        );
    else
        return (
            <View style={styles}>
                <ActivityIndicator color={'#333'} />
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