import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Text } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function Course({ name, description }) {
    return (
        <View style={styles.singleCourseView}>
            <View style={{ flexDirection: 'row', }}>
                <View>
                    <Text style={styles.SubjectTitle}>
                        {name}
                    </Text>
                    <Text style={styles.SubjectDescription}>
                        {description}
                    </Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={30} color="red"
                    style={{ marginTop: 20, paddingStart: 27, marginStart: 'auto', paddingEnd: 20, alignSelf: "auto" }} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    singleCourseView: {
        borderColor: 'grey',
        width: Dimensions.get('screen').width - 15,
        height: "auto",
        marginTop: 10,
        backgroundColor: '#ffffff',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    SubjectTitle: {
        marginTop: 5,
        paddingStart: 20,
        fontSize: 18,
        fontWeight: 'bold',
    },
    SubjectDescription: {
        paddingStart: 20,
        marginTop: 5,
        marginBottom: 10,
        color: 'grey',
        width: 320,
        height: 'auto'
    }
});

export default React.memo(Course);