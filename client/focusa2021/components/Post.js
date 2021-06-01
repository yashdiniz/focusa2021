import React from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PostDetailsNavigate } from '../constants/screens';
import { connectProps } from '../hooks/store';

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

function Post({ parent, author, course, time, text, attachmentURL, navigation, uuid, username }) {
    // TODO: make provisions for parent and comments!

    return (
        <View style={styles.PostView}>
            {
                parent ? <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('PostDetails', {
                            ...PostDetailsNavigate,
                            params: { postID: parent }
                        })}
                    >
                        <View>
                            <Text style={{
                                ...styles.userName,
                                paddingTop: 10,
                                fontStyle: 'italic',
                                color: 'gray'
                            }}>
                                Comment
                    </Text>
                        </View>
                    </TouchableOpacity>

                    {
                        (username === author) ? (<TouchableOpacity style={{ marginLeft: 'auto', paddingRight: 15, marginTop: 10 }}>
                            <MaterialCommunityIcons name="dots-vertical" size={25} style={{ marginTop: 'auto', paddingStart: 27 }} />
                        </TouchableOpacity>) : null
                    }


                </View> : null
            }
            {
                course ? <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.subjectName}>{course}</Text>
                    {
                        (username === author) ? (<TouchableOpacity style={{ marginLeft: 'auto', paddingRight: 15, marginTop: 'auto' }}>
                            <MaterialCommunityIcons name="dots-vertical" size={25} style={{ marginTop: 'auto', paddingStart: 27 }} />
                        </TouchableOpacity>) : null
                    }
                </View>
                    : null
            }
            <View style={{ flexDirection: "row" }}>
                <Text style={styles.userName}
                // onPress={() => navigation.navigate('Profile', {
                //     ...ProfileNavigate,
                //     params: { username: author }
                // })}
                >{author}</Text>
                <Text>  |  </Text>
                <Text style={styles.time}>{formatTime(time)}</Text>
            </View>

            <Text style={styles.text}>{text}</Text>

            {
                attachmentURL.length > 0 ?
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        {/* https://stackoverflow.com/a/30540502/13227113 */}
                        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={Linking.openURL(attachmentURL)}>
                            <MaterialCommunityIcons name="file-document" size={20} style={{ marginTop: 25, paddingStart: 27, }} />
                            <Text style={{ marginTop: 28 }}>View Attachments</Text>
                        </TouchableOpacity>
                    </View>
                    : <></>
            }

            <View style={{ flexDirection: 'row', marginTop: 20, marginBottom: 10 }}>
                {parent ?
                    <></>
                    : <TouchableOpacity style={{ marginBottom: 10 }}
                        onPress={() => navigation.navigate('PostDetails', {
                            ...PostDetailsNavigate,
                            params: { postID: uuid }
                        })}
                    >
                        <MaterialCommunityIcons name="comment-outline" wi size={25} style={{ marginTop: 'auto', paddingStart: 27 }} />
                    </TouchableOpacity>
                }

                <TouchableOpacity style={{ marginBottom: 10 }}>
                    <MaterialCommunityIcons name="arrow-right" size={25} style={{ marginTop: 'auto', paddingStart: 27, }} />
                </TouchableOpacity>


                <TouchableOpacity style={{ marginLeft: 'auto', paddingRight: 15, marginBottom: 10 }}>
                    <MaterialCommunityIcons name="download" size={25} style={{ marginTop: 'auto', paddingStart: 27 }} />
                </TouchableOpacity>
            </View>

        </View >
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
        paddingStart: 15,
        paddingTop: 10,
        fontSize: 15,
        fontWeight: 'bold'
    },
    userName: {
        paddingStart: 15,
        color: 'red'
    },
    time: {
        color: 'grey',
        textAlign: 'left',
    },
    text: {
        marginTop: 20,
        paddingStart: 15,
        fontSize: 15,
        color: 'black',
        width: Dimensions.get('screen').width - 8,
        height: "auto",
    },
})

export default connectProps(React.memo(Post));