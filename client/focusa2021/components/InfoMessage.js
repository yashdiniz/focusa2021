import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-elements';

function InfoMessage({ title, message }) {
    return (
        <View style={styles.container}>
            <Text
                h4
            >
                {title}
            </Text>
            <Text>
                {message}
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

export default React.memo(InfoMessage);