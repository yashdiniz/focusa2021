import { useMutation, useQuery } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View, StyleSheet, RefreshControl, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { connectProps } from '../hooks/store';
import { getCourseDetails, getUserRole, subscribeToCourse, unsubscribeFromCourse, createPost } from '../constants/queries';
import Post from '../components/Post';
import { FlatList } from 'react-native-gesture-handler';
import ErrorComponent from '../components/ErrorComponent';
import InfoMessage from '../components/InfoMessage';
import { FAB, Overlay, Input, Button } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PublishPostNavigate } from '../constants/screens';



function CourseDetails({ navigation, route, token, userID, username }) {
    const courseID = route.params?.courseID;

    // TODO: allow users to subscribe to courses from here!
    const [refreshing, setRefreshing] = useState(false);

    //Toggle overlay
    const [publishPostVisible, setVisiblePublishPost] = useState(false);
    const toggleOverlayPublishPost = () => {
        setVisiblePublishPost(!publishPostVisible)
    }

    const [text, setText] = useState('');

    const { data, error, loading, refetch, fetchMore } = useQuery(getCourseDetails, {
        variables: {
            userID,
            courseID,
            offset: 0,
        },
    });

    const { data: dataRoles } = useQuery(getUserRole, {
        variables: {
            username,
            courseID
        }
    });

    // //ref:https://stackoverflow.com/questions/1885557/simplest-code-for-array-intersection-in-javascript
    // const filterArray = dataRoles.course.mods.filter(value => dataRoles.user.roles.map(i => i.name).includes(value.name));
    const [subscribe] = useMutation(subscribeToCourse, {
        refetchQueries: getCourseDetails,
        awaitRefetchQueries: true,
        onCompleted() {
            onRefresh();
        },
    });
    const [unsubscribe] = useMutation(unsubscribeFromCourse, {
        refetchQueries: getCourseDetails,
        awaitRefetchQueries: true,
        onCompleted() {
            onRefresh();
        },
    });

    const [createPostfun] = useMutation(createPost, {
        refetchQueries: getCourseDetails,
        awaitRefetchQueries: true,
        onCompleted(){
            onRefresh();
        }
    })

    const onPublish = React.useCallback(() => {
        createPostfun({
            variables: {
                text,
                courseID,
            }
        })
        toggleOverlayPublishPost();
    });

    // Reference: https://stackoverflow.com/questions/1885557/simplest-code-for-array-intersection-in-javascript
    const filteredArray = dataRoles?.course.mods
        .filter(value =>
            dataRoles.user.roles
                .map(i => i.name)
                .includes(value.name)
        );

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
        if (!token || token.length < 20) navigation.navigate('Login');
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
        return (<ErrorComponent error={error} />);
    else
        return (
            <View style={{ height: Dimensions.get('screen').height - 130 }}>
                <FlatList
                    // style={{backgroundColor:'white'}}
                    containerStyle={styles/*.container*/}
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
                        // <Course
                        //     name={data.course.name}
                        //     description={data.course.description}
                        // />
                        <View style={styles.SubjectPageHeaderView}>
                            <Text style={styles.SubjectTitle}>
                                {data.course.name}
                            </Text>


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
                <Overlay isVisible={publishPostVisible}>
                    <ScrollView contentContainerStyle={{
                        width: Dimensions.get('window').width,
                        height: Dimensions.get('window').height,
                        alignItems: 'center'
                    }}>
                        <Text style={{fontSize:20, fontWeight:'bold',marginRight:'auto'}}>Publish Post</Text>
                        <Input
                            placeholder='enter text here...'
                            label="Post Description"
                            leftIcon={
                                <MaterialCommunityIcons name="pencil" size={24} />
                            }
                            containerStyle={{ width: Dimensions.get('screen').width , marginTop: 10 }}
                            labelStyle={{ color: 'red' }}
                            onChangeText={(x) => setText(x)}
                        />
                        {
                            console.log(text)
                        }

                        <View style={{flexDirection:'row',}}>
                            <Button
                                title="Publish"
                                buttonStyle={{ width: 120, marginRight:15}}
                                onPress={onPublish}

                            />

                            <Button
                                title="Cancel"
                                buttonStyle={{ width: 120, backgroundColor:'red' }}
                                onPress={toggleOverlayPublishPost}
                            />
                        </View>

                       

                    </ScrollView>
                </Overlay>
                {
                    (filteredArray?.length > 0) ? <FAB placement="right"
                        color="red"
                        size="large"
                        icon={{ name: 'create', color: "white" }}
                        style={{ position: 'absolute', bottom: 0 }}
                        onPress={
                            toggleOverlayPublishPost
                            // () => navigation.navigate('PublishPost', {
                            //     ...PublishPostNavigate, params: { courseID }
                            // })
                        } />
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
    SujectPageView: {
        alignContent: 'center',
        justifyContent: 'center',
    },
    SubjectPageHeaderView: {
        width: Dimensions.get('screen').width,
        height: 150,
        backgroundColor: '#C0C0C0',
        alignItems: 'center',
        justifyContent: 'center',
        height: "auto",
    },
    SubjectTitle: {
        marginTop: 10,
        fontSize: 30
    },
    SubjectDescription: {
        marginTop: 5,
        fontSize: 15,
        marginLeft: 10,
    }
});

export default connectProps(CourseDetails);