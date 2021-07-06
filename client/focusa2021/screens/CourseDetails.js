import { useMutation, useQuery } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Text, View, StyleSheet, RefreshControl, Dimensions, TouchableOpacity } from 'react-native';
import { connectProps } from '../hooks/store';
import { getCourseDetails, getUserRole, subscribeToCourse, unsubscribeFromCourse } from '../constants/queries';
import Post from '../components/Post';
import { FlatList } from 'react-native-gesture-handler';
import ErrorComponent from '../components/ErrorComponent';
import InfoMessage from '../components/InfoMessage';
import { FAB, BottomSheet, ListItem, Icon } from 'react-native-elements';
import PublishOverlay from '../components/PublishOverlay';
import EditCourseOverlay from '../components/EditCourseOverlay';
import { refresh } from '../hooks/authenticate';


function CourseDetails({ navigation, route, token, userID, username }) {
    const courseID = route.params?.courseID;

    const [refreshing, setRefreshing] = useState(false);
    //Toggle overlay
    const [publishPostVisible, setVisiblePublishPost] = useState(false);
    const toggleOverlayPublishPost = () => {
        setVisiblePublishPost(!publishPostVisible)
    }

    const [editCourseVisible, setVisibleEditCourse] = useState(false);
    const toggleOverlayEditCourse = () => {
        setVisibleEditCourse(!editCourseVisible)
    }

    //toggle bottom sheet
    const [bottomSheetVisible, makeBottomSheetVisible] = useState(false);
    const toggleBottomSheet = () => {
        makeBottomSheetVisible(!bottomSheetVisible);
    }

    const { data, error, loading, refetch, fetchMore } = useQuery(getCourseDetails, {
        variables: {
            userID,
            courseID,
            offset: 0,
        },
        fetchPolicy: 'no-cache'
    });

    const { data: dataRoles } = useQuery(getUserRole, {
        variables: {
            username,
            courseID
        }
    });

    // Reference: https://stackoverflow.com/questions/1885557/simplest-code-for-array-intersection-in-javascript
    const filteredArray = dataRoles?.course.mods
        .filter(value =>
            dataRoles.user.roles
                .map(i => i.name)
                .includes(value.name)
        );

    const [subscribe] = useMutation(subscribeToCourse, {
        refetchQueries: [{
            query: getCourseDetails,
            variables: {
                userID,
                courseID,
                offset: 0,
            },
        }],
        awaitRefetchQueries: true,
        onCompleted() {
            onRefresh();
        },
    });
    const [unsubscribe] = useMutation(unsubscribeFromCourse, {
        refetchQueries: [{
            query: getCourseDetails,
            variables: {
                userID,
                courseID,
                offset: 0,
            },
        }],
        awaitRefetchQueries: true,
        onCompleted() {
            onRefresh();
        },
    });


    /**
     * Callback used to inform completion of refresh.
     */
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // refresh will cause refetching of the query
        // once refetched, it will cause a re-render.
        refetch().then(() => setRefreshing(false))
            .catch(e => {
                setRefreshing(false);
                console.error(new Date(), 'CourseDetails Refresh', e);
            });
    });

    useEffect(() => {
        // if JWT is too short, it is usually because it is invalid.
        if (!token || token.length < 20) refresh()
            .catch(() => navigation.navigate('Login'));
        if (error) {
            console.error(new Date(), 'CourseDetails', JSON.stringify(error));
        }
    });

    if (loading)
        return (
            <View style={styles.container}>
                <ActivityIndicator color={'#333'} />
            </View>
        );
    else if (error)
        return (<ErrorComponent error={error} refresh={onRefresh} />);
    else
        return (
            <View style={{ height: Dimensions.get('window').height - 100, justifyContent: 'space-between' }}>
                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    data={data.course.posts}
                    keyExtractor={
                        item => item.uuid
                    }
                    ListHeaderComponent={
                        <View style={styles.SubjectPageHeaderView}>
                            <TouchableOpacity style={{ paddingRight: 20, marginTop: 20, marginStart: 'auto' }}
                                onPress={() => makeBottomSheetVisible(true)}
                            >
                                <Ionicons name="ellipsis-vertical" size={20} style={{ marginTop: 'auto', paddingStart: 27, color: 'white' }} />
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.SubjectTitle}>
                                    {data.course.name}
                                </Text>
                            </View>

                            <Text style={styles.SubjectDescription}>
                                {data.course.description}
                            </Text>

                            <TouchableOpacity
                                style={{
                                    backgroundColor: 'white',
                                    width: 200,
                                    alignItems: 'center',
                                    height: 30,
                                    justifyContent: 'center',
                                    borderColor: 'black',
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    marginTop: 15,
                                    marginBottom: 10,
                                }}
                                onPress={
                                    () => data.isSubscribed ?
                                        unsubscribe({
                                            variables: { courseID }
                                        }) :
                                        subscribe({
                                            variables: { courseID }
                                        })
                                }
                            >
                                <Text>
                                    {
                                        data.isSubscribed ?
                                            'Subscribed' :
                                            'Subscribe'
                                    }
                                </Text>
                            </TouchableOpacity>

                        </View>
                    }
                    ListEmptyComponent={
                        <InfoMessage
                            title={'No Posts published'}
                            message={"You're up to date!"}
                        />
                    }
                    renderItem={
                        ({ item }) =>
                            <Post
                                parent={item.parent?.uuid}
                                key={item.uuid}
                                uuid={item.uuid}
                                author={item.author.name}
                                course={item.course.name}
                                text={item.text}
                                time={item.time}
                                attachmentURL={item.attachmentURL}
                                navigation={navigation}
                                onRefresh={onRefresh}
                            />
                    }
                    ListFooterComponent={
                        data.course.posts?.length > 0 ?
                            <View style={styles.container}>
                                <TouchableOpacity
                                    onPress={
                                        () => fetchMore({
                                            variables: {
                                                offset: data.course.posts?.length
                                            }
                                        })
                                    }
                                >
                                    <Text>
                                        Yay! You are up to date!
                            </Text>
                                </TouchableOpacity>
                            </View>
                            : <></>
                    }
                />
                {/* The BottomSheet for extra options */}
                <BottomSheet
                    isVisible={bottomSheetVisible}
                    containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                >
                    <ListItem
                        onPress={() => toggleOverlayEditCourse()}
                    >
                        <Icon name="edit" />
                        <ListItem.Content>
                            <ListItem.Title>Edit Course</ListItem.Title>
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
                <PublishOverlay
                    onRefresh={onRefresh}
                    courseID={courseID}
                    toggleOverlayPublishPost={toggleOverlayPublishPost}
                    publishPostVisible={publishPostVisible}
                />

                <EditCourseOverlay
                    onRefresh={onRefresh}
                    courseID={courseID}
                    name={data.course.name}
                    description={data.course.description}
                    toggleOverlayEditCourse={toggleOverlayEditCourse}
                    editCourseVisible={editCourseVisible}
                    toggleBottomSheet={toggleBottomSheet}
                />
                {
                    (filteredArray?.length > 0) ?
                        <FAB
                            placement="right"
                            color="red"
                            size="large"
                            icon={{ name: 'create', color: "white" }}
                            style={{ position: 'absolute', bottom: 0 }}
                            onPress={toggleOverlayPublishPost} />
                        : null
                }
            </View>
        );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30
    },
    SubjectPageHeaderView: {
        width: Dimensions.get('screen').width,
        backgroundColor: 'darkred',
        alignItems: 'center',
        justifyContent: 'center',
        height: "auto",
    },
    SubjectTitle: {
        marginTop: 10,
        fontSize: 30,
        color: 'white'
    },
    SubjectDescription: {
        marginTop: 5,
        fontSize: 15,
        marginLeft: 10,
        color: 'white'
    }
});

export default connectProps(CourseDetails);