import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-elements';

function Post(props/*{ author, course, time, text, attachmentURL }*/) {
    // TODO: make provisions for parent and comments!

    // Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
    const date = new Date(time);
    console.log('Date in Post', date.toUTCString(), date.toISOString());
    console.log(`Custom Date string: ${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`)

    return (
        <Card>
            <Text>
                {JSON.stringify(props)}
            </Text>
        </Card>
    );
}

export default Post;