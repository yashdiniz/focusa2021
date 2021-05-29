import React from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const formatTime = (time) => {
    var TimeType, hour, minutes, fullTime;

    // Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
    try {
        const date = new Date(parseInt(time));
        hour = date.getHours();

        // Checking if the Hour is less than equals to 11 then Set the Time format as AM.
        if (hour <= 11) {
            TimeType = 'AM';
        }
        else {
            // If the Hour is Not less than equals to 11 then Set the Time format as PM.
            TimeType = 'PM';
        }
        // IF current hour is grater than 12 then minus 12 from current hour to make it in 12 Hours Format.
        if (hour > 12) {
            hour = hour - 12;
        }

        // If hour value is 0 then by default set its value to 12, because 24 means 0 in 24 hours time format. 
        if (hour == 0) {
            hour = 12;
        }

        // Getting the current minutes from date object.
        minutes = date.getMinutes();

        // Checking if the minutes value is less then 10 then add 0 before minutes.
        if (minutes < 10) {
            minutes = '0' + minutes.toString();
        }
        fullTime = hour.toString() + ':' + minutes.toString() + ' ' + TimeType.toString();

        return (<Text style={{ color: 'grey' }}>{date.getFullYear()}-{date.getMonth()}-{date.getDate()} {fullTime}</Text>)

    } catch (e) {
        return 'Invalid Time';
    }
}

function Post({ parent, author, course, time, text, attachmentURL }) {
    // TODO: make provisions for parent and comments!

    return (
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



            <View style={{ flexDirection: 'row', marginTop: 20, marginBottom: 10 }}>
                {parent ?
                    <></>
                    : <TouchableOpacity >
                        <MaterialCommunityIcons name="comment-processing-outline" size={30} style={{ marginTop: 'auto', paddingLeft: 27 }} />
                    </TouchableOpacity>
                }

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
        height: 'auto',
        borderColor: 'lightgrey',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        marginTop: 5,
        backgroundColor: '#ffffff'
    },
    subjectName: {
        marginTop: "auto",
        paddingLeft: 10,
        fontSize: 15,
        fontWeight: 'bold'
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

export default React.memo(Post);