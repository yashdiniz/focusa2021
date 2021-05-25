import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Card, Text, Button } from 'react-native-elements';

function Course({ name, description }) {
    return (
        <Card containerStyle={{borderColor:'black', borderRadius:20, backgroundColor:'white'}}>
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