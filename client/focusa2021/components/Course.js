import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-elements';

function Course({ name, description }) {
    return (
        <Card>
            <Text 
                h4
                style={styles.text}
            >
                {name}
            </Text>
            <Card.Divider />
            <Text
                style={styles.text}
            >
                {description}
            </Text>
        </Card>
    );
}

const styles = StyleSheet.create({
    text: {
        marginBottom: 20,
    }
});

export default Course;