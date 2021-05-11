import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function NotFoundScreen() {
    return (
        <View style={styles}>
            <Text>We couldn't find the page you requested. Tell us there was a bug!!</Text>
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