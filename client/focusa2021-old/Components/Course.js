import React from 'react';
import { View, Text } from 'react-native';
import styles from '../Styles/CourseStyles';

const Course = () => {
    return (
        <View style={styles.singleCourseView}>
            <Text style={styles.SubjectTitle}>
                Compiler Constructions
            </Text>
            <Text style={styles.SubjectDescription}>
                All notes and Videos pertaining to Compiler Constructions will be posted here.
            </Text>
        </View>
    )
}

export default Course;
