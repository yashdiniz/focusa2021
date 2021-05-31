import { useQuery } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View, StyleSheet, RefreshControl, Dimensions, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements'
import { connectProps } from '../hooks/store';
import Post from '../components/Post';
import { FlatList } from 'react-native-gesture-handler';
import ErrorComponent from '../components/ErrorComponent';
import InfoMessage from '../components/InfoMessage';
import { getPostComments } from '../constants/queries';

function PostDetails({ navigation, route, token }) {
    const postID = route.params?.postID;  // the postID is taken from route params

    const [refreshing, setRefreshing] = useState(false);

    const { data, error, loading, refetch, fetchMore } = useQuery(getPostComments, {
        variables: {
            postID,
            offset: 0,
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
                console.error(new Date(), 'PostDetails Refresh', e);
            });
    });

    useEffect(() => {
        // if JWT is too short, it is usually because it is invalid.
        if (!token || token.length < 20) navigation.navigate('Login');
        if (error) {
            console.error(new Date(), 'PostDetails', JSON.stringify(error));
        }
    });

    if (loading)
        return (
            <View style={styles.container}>
                <ActivityIndicator color={'#333'} />
            </View>
        );
    if (error)
        return (<ErrorComponent error={error} />);

    return (
        <View style={{height:Dimensions.get('screen').height-90 ,justifyContent:'space-between'}}>
            <FlatList
                // style={{backgroundColor:'white'}}
                containerStyle={styles/*.container*/}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                data={data.post?.comments}
                keyExtractor={
                    item => item.uuid
                }
                ListHeaderComponent={
                    <Post
                        parent={data.post.parent?.uuid}
                        key={data.post.uuid}
                        uuid={data.post.uuid}
                        author={data.post.author.name}
                        course={data.post.course?.name}
                        text={data.post.text}
                        time={data.post.time}
                        attachmentURL={data.post.attachmentURL}
                        navigation={navigation}
                    />
                }
                ListEmptyComponent={
                    <InfoMessage
                        title={'Could not find comments'}
                        message={"Publish some comments and they'll show up here!"}
                    />
                }
                renderItem={
                    ({ item }) =>
                        <Post
                            parent={item.parent?.uuid}
                            key={item.uuid}
                            uuid={item.uuid}
                            author={item.author.name}
                            course={item.course?.name}
                            text={item.text}
                            time={item.time}
                            attachmentURL={item.attachmentURL}
                            navigation={navigation}
                        />
                }
                ListFooterComponent={
                    data.post?.comments.length > 0 ?
                        <View style={styles.container}>
                            <TouchableOpacity
                                onPress={
                                    () => fetchMore({
                                        variables: {
                                            offset: data.post?.comments.length
                                        }
                                    })
                                }
                            >
                                <Text>
                                    No new comments
                            </Text>
                            </TouchableOpacity>
                        </View>
                        : <></>
                }
            />
            <TouchableOpacity style={{
                width: Dimensions.get('screen').width - 20,
                margin: 10,
                height: 40,
                backgroundColor: 'white',
                paddingLeft: 10,
                paddingRight: 10,
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <Avatar
                    size="small"
                    rounded
                    icon={{name: 'user', type: 'font-awesome'}}
                    onPress={() => console.log("Works!")}
                    activeOpacity={0.7}
                    containerStyle={{backgroundColor:'grey', marginRight:10}}
                />

                <Text style={{ color: 'grey' }}>Share comments....</Text>
            </TouchableOpacity>
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
    },
    SubjectTitle: {
        marginTop: 10,
        fontSize: 30
    },
    SubjectDescription: {
        marginTop: 5,
        fontSize: 15,
        marginLeft: 10,
    },

});

export default connectProps(PostDetails);