import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, Linking, Alert } from 'react-native';
import { BottomSheet, Text, ListItem, Icon } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { PostDetailsNavigate } from '../constants/screens';
import { connectProps } from '../hooks/store';
import { useMutation } from '@apollo/client';
import EditPostOverlay from './EditPostOverlay';
import { deletePost, getCourseDetails } from '../constants/queries';

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



function Post({ parent, author, course, time, text, attachmentURL, navigation, uuid, username, onRefresh }) {

    const [bottomSheetVisible, makeBottomSheetVisible] = useState(false);
    const toggleBottomSheet =()=>{
        makeBottomSheetVisible(!bottomSheetVisible);
    }

    const [deletePostfun] = useMutation(deletePost, {
        refetchQueries: getCourseDetails,
        awaitRefetchQueries: true,
        onCompleted() {
            onRefresh()
        }
    });

    const onDelete = React.useCallback(() => {
        deletePostfun({
            variables: {
                uuid,
            }
        })
        makeBottomSheetVisible(false);
    });

    //Toggle overlay
    const [editPostVisible, setVisibleEditPost] = useState(false);
    const toggleOverlayEditPost = () => {
        setVisibleEditPost(!editPostVisible)
    }



    return (
        <View style={styles.PostView}>

            {/* The post title View */}
            <View style={{ flexDirection: 'row' }}>
                {
                    parent ?
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
                        </TouchableOpacity> : null
                }
                {
                    course ? <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.subjectName}>{course}</Text>
                    </View>
                        : null
                }
                {
                    (username === author) ? (<TouchableOpacity style={{ marginLeft: 'auto', paddingRight: 15, marginTop: 10 }}
                        onPress={() => makeBottomSheetVisible(true)}
                    >
                        <Ionicons name="ellipsis-vertical" size={20} style={{ marginTop: 'auto', paddingStart: 27 }} />
                    </TouchableOpacity>) : null
                }
            </View>

            {/* The post metadata View */}
            <View style={{ flexDirection: "row" }}>
                <Text style={styles.userName}
                >{author}</Text>
                <Text>  |  </Text>
                <Text style={styles.time}>{formatTime(time)}</Text>
            </View>

            {/* The post body Text */}
            <Text style={styles.text}>{text}</Text>

            {/* The optional attachment View */}
            {
                attachmentURL.length > 0 ?
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        {/* https://stackoverflow.com/a/30540502/13227113 */}
                        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={Linking.openURL(attachmentURL)}>
                            <Ionicons name="document-attach-outline" size={20} style={{ marginTop: 25, paddingStart: 27, }} />
                            <Text style={{ marginTop: 28 }}>View Attachments</Text>
                        </TouchableOpacity>
                    </View>
                    : <></>
            }

            {/* The bottom options View */}
            <View style={{ flexDirection: 'row', marginTop: 20, marginBottom: 20 }}>
                {parent ?
                    <></>
                    : <TouchableOpacity
                        // style={{ marginBottom: 10 }}
                        onPress={() => navigation.navigate('PostDetails', {
                            ...PostDetailsNavigate,
                            params: { postID: uuid }
                        })}
                    >
                        <Ionicons name="chatbubble-outline" wi size={25}
                            style={{ marginTop: 'auto', paddingStart: 27 }}
                        />
                    </TouchableOpacity>
                }

                <TouchableOpacity
                // style={{ marginBottom: 10 }}
                >
                    <Ionicons name="share-social-outline" size={25}
                        style={{ marginTop: 'auto', paddingStart: 27, }}
                    />
                </TouchableOpacity>


                <TouchableOpacity
                // style={{ marginLeft: 'auto', paddingRight: 15, marginBottom: 10 }}
                >
                    <Ionicons name="download-outline" size={25}
                        style={{ marginTop: 'auto', paddingStart: 27 }}
                    />
                </TouchableOpacity>
            </View>

            {/* The BottomSheet for extra options */}
            <BottomSheet
                isVisible={bottomSheetVisible}
                containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            >
                <ListItem
                    onPress={() => toggleOverlayEditPost()}
                >
                    <Icon name="edit" />
                    <ListItem.Content>
                        <ListItem.Title>{(course == null ? 'Edit Comment' : 'Edit Post')}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                <ListItem
                    onPress={() => Alert.alert(
                        "Alert",
                        (course == null ? 'Delete Comment?' : 'Delete Post?'),
                        [
                            {
                                text: "Cancel",
                                onPress: () => makeBottomSheetVisible(false),
                                style: "cancel"
                            },
                            { text: "OK", onPress: () => onDelete() }
                        ]
                    )}
                >
                    <Icon name="delete" />
                    <ListItem.Content>
                        <ListItem.Title>{(course == null ? 'Delete Comment' : 'Delete Post')}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                <ListItem
                    containerStyle={{ backgroundColor: 'red', }}
                    onPress={() => makeBottomSheetVisible(false)}
                >
                    <Icon name="cancel" />
                    <ListItem.Content>
                        <ListItem.Title style={{ color: 'white' }}>Cancel</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
            </BottomSheet>

            <EditPostOverlay
                    postID={uuid}
                    currentText={text}
                    toggleOverlayEditPost={toggleOverlayEditPost}
                    editPostVisible={editPostVisible}
                    toggleBottomSheet={toggleBottomSheet}
                    onRefresh={onRefresh}
            />
                   

        </View >
    );
}
const styles = StyleSheet.create({
    PostView: {
        width: Dimensions.get('screen').width,
        height: 'auto',
        borderColor: 'lightgrey',
        borderTopWidth: 0,
        borderBottomWidth: 1,
        paddingTop: 10,
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