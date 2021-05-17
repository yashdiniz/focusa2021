import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-elements';

function Course({ name, description }) {
    return (
        <Card>
            <Text 
                h1
                style={styles.text}
            >
                {name}
            </Text>
            <Text
                style={{
                    ...styles.text,
                    marginBottom: 20,
                }}
            >
                {description}
            </Text>
        </Card>
    );
}

const styles = StyleSheet.create({
    text: {
        marginLeft: 20,
    }
});

export default Course;