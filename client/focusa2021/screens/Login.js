import React, { useState } from 'react';
import { ActivityIndicator, View, StyleSheet, Button } from 'react-native';
import { authenticate } from '../hooks/authenticate';

export default function Login({ navigation, route }) {
    const [loading, setLoaded] = useState(false);

    authenticate('admin','gyroscope')  // REMOVE THIS LINE ASAP!!
    .then(() => setLoaded(true));

    if (loading)
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