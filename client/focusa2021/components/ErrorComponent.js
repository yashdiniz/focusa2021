import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-elements';

function ErrorComponent({ error, refresh }) {
    let message = JSON.stringify(error);
    if (error.message) message = error.message;
    if (error.networkError) {
        message = 'Unable to access the network. Please check your network connection.';
    }
    // if (error.graphQLErrors?.length > 0) {        
    // }

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
                {message}
            </Text>
            
            <Button
                containerStyle={{
                    marginTop: 30
                }}
                onPress={refresh}
                title={'Retry'}
            />
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

export default React.memo(ErrorComponent);