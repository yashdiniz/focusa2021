import React from 'react';
import { Alert, StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native';
import { Card, Text, Button } from 'react-native-elements';

function Course({ name, description }) {
    return (
        // <Card>
        //         <Text 
        //             h4
        //             style={styles.text}
        //         >
        //             {name}
        //         </Text>
        //     <Card.Divider />
        //     <Text
        //         style={styles.text}
        //     >
        //         {description}
        //     </Text>
        // </Card>

        <View style={styles.singleCourseView}>
            <Text style={styles.SubjectTitle}>
                {name}
            </Text>
            <Text style={styles.SubjectDescription}>
                {description}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        marginBottom: 20,
    },
    singleCourseView: {
        borderColor: 'grey',
        borderWidth: 1,
        width: Dimensions.get('screen').width - 25,
        height: 100,
        margin: 10,
        backgroundColor: '#ffffff',
        borderRadius: 16,

    },
    SubjectTitle: {
        marginTop: 10,
        paddingLeft: 10,
        fontSize: 18,
        fontWeight: 'bold',
    },
    SubjectDescription: {
        paddingLeft: 20,
        marginTop: 10,
        color: 'grey'
    }
});

export default Course;