import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';

function ErrorComponent({ error }) {
    return (
        <View style={styles.container}>
            <Text
                h4
            >
                Error!
            </Text>
            <Text style={{
                color: 'red'
            }}>
                {JSON.stringify(error)}
            </Text>
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

export default ErrorComponent;