import React from 'react';
import { Alert, StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native';
import { Card, Text, Button } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons'

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
            <View style={{ flexDirection: 'row' }}>
                <View>
                    <Text style={styles.SubjectTitle}>
                        {name}
                    </Text>
                    <Text style={styles.SubjectDescription}>
                        {description}
                    </Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={30} color="red"
                    style={{ marginTop: 20, paddingLeft: 27, marginLeft: 'auto', alignSelf: 'flex-end', paddingRight:20 }} />
            </View>

        </View>


    );
}

const styles = StyleSheet.create({
    text: {
        marginBottom: 20,
    },
    singleCourseView: {
        borderColor: 'grey',
        width: Dimensions.get('screen').width-15,
        height: "auto",
        marginTop:17,
        backgroundColor: '#ffffff',
        borderTopRightRadius:10,
        borderBottomRightRadius:10,
    },
    SubjectTitle: {
        marginTop: 5,
        paddingLeft: 10,
        fontSize: 18,
        fontWeight: 'bold',
    },
    SubjectDescription: {
        paddingLeft: 20,
        marginTop: 5,
        marginBottom:10,
        color: 'grey',
        width:320,
        height:'auto'
    }
});

export default React.memo(Course);