import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';

export default function NotFoundScreen() {
    return (
        <View style={styles.container}>
            <Text>
                We couldn't find the screen you requested.
            </Text>
            <Text
                style={{
                    fontStyle: 'italic',
                }}
            >
                Tell us there was a bug!!
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
});