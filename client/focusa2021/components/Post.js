import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-elements';

function Post(props/*{ author, course, time, text, attachmentURL }*/) {
    return (
        <Card>
            <Text>
                {JSON.stringify(props)}
            </Text>
        </Card>
    );
}

export default Post;