import React from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const formatTime = (time) => {
    // Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
    try {
        const date = new Date(parseInt(time));

        // console.log('Date in Post', date.toUTCString(), date.toISOString());
        // console.log(`Custom Date string: ${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`)

        return date.toUTCString();
    } catch (e) {
        return 'Invalid Time';
    }
}

function Post({ parent, author, course, time, text, attachmentURL }) {
    // TODO: make provisions for parent and comments!

    return (
        // <Card>
        //     <Text>
        //         {JSON.stringify(props)}
        //     </Text>
        // </Card>

        <View style={styles.PostView}>
            <Text style={{
                fontStyle: 'italic',
                color: 'lightgray'
            }}>
                {parent ? 'Comment' : ''}
            </Text>
            <Text style={styles.subjectName}>{course}</Text>

            <View style={{ flexDirection: "row" }}>
                <Text style={styles.userName}>{author}</Text>
                <Text>  |  </Text>
                <Text style={styles.time}>{formatTime(time)}</Text>
            </View>

           
            <Text style={styles.topictitle}>{text}</Text>

            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                {/* https://stackoverflow.com/a/30540502/13227113 */}
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={attachmentURL.length > 0 ? Linking.openURL(attachmentURL) : null}>
                    <MaterialCommunityIcons name="file-document" size={30} style={{ marginTop: 20, paddingLeft: 27 }} />
                    <Text style={{ marginTop: 28 }}>View Attachments</Text>
                </TouchableOpacity>
            </View>

            

            <View style={{ flexDirection: 'row', marginTop:20 }}>
                <TouchableOpacity >
                    <MaterialCommunityIcons name="comment-processing-outline" size={30} style={{ marginTop:'auto', paddingLeft: 27 }} />
                </TouchableOpacity>

                <TouchableOpacity>
                    <MaterialCommunityIcons name="share-outline" size={30} style={{ marginTop: 'auto', paddingLeft: 27 }} />
                </TouchableOpacity>


                <TouchableOpacity style={{ marginLeft: 'auto', paddingRight: 15 }}>
                    <MaterialCommunityIcons name="download-outline" size={30} style={{ marginTop: 'auto', paddingLeft: 27 }} />
                </TouchableOpacity>
            </View>

        </View>
    );
}
const styles = StyleSheet.create({
    PostView: {
        width: Dimensions.get('screen').width,
        height:'auto',
        borderColor: 'lightgrey',
        borderTopWidth: 2,
        marginTop: 10,
        backgroundColor: '#ffffff'
    },
    subjectName: {
        marginTop: "auto",
        paddingLeft: 10,
        fontSize: 15,
        fontWeight:'bold'
    },
    userName: {
        paddingLeft: 10,
        color: 'red'
    },
    time: {
        color: 'grey',
        textAlign: 'left',
    },
    topictitle: {
        marginTop: 20,
        paddingLeft: 10,
        fontSize: 15,
    },
})
export default Post;