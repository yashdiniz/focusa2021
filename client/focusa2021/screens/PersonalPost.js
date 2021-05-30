import { useQuery } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View, StyleSheet, RefreshControl, Dimensions, TouchableOpacity } from 'react-native';
import { connectProps } from '../hooks/store';
import { personalPosts } from '../constants/queries';
import Post from '../components/Post';
import { FlatList } from 'react-native-gesture-handler';
import ErrorComponent from '../components/ErrorComponent';
import InfoMessage from '../components/InfoMessage';

function PersonalPost({ navigation, route, token, username }) {
    username = route.params?.username ?
        route.params.username : username;

    const [refreshing, setRefreshing] = useState(false);

    const { data, error, loading, refetch, fetchMore } = useQuery(personalPosts, {
        variables: {
            username,
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
                console.error(new Date(), 'PersonalPost Refresh', e);
            });
    });

    useEffect(() => {
        // if JWT is too short, it is usually because it is invalid.
        if (!token || token.length < 20) navigation.navigate('Login');
        if (error) {
            console.error(new Date(), 'PersonalPosts', JSON.stringify(error));
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
        <FlatList
            // style={{backgroundColor:'white'}}
            containerStyle={styles/*.container*/}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
            data={data.user?.posts}
            keyExtractor={
                item => item.uuid
            }
            ListHeaderComponent={
                // <Course
                //     name={data.course.name}
                //     description={data.course.description}
                // />
                // <View style={styles.SubjectPageHeaderView}>
                //     <Text style={styles.SubjectTitle}>
                //         {data.course.name}
                //     </Text>


                //     <Text style={styles.SubjectDescription}>
                //         {data.course.description}
                //     </Text>

                //     <TouchableOpacity style={{
                //         backgroundColor: 'white',
                //         width: 200,
                //         alignItems: 'center',
                //         height: 30,
                //         justifyContent: 'center',
                //         borderColor: 'black',
                //         borderWidth: 1,
                //         borderRadius: 10,
                //         marginTop: 15,
                //         marginBottom: 10,
                //     }}>
                //         <Text>
                //             {
                //                 data.isSubscribed ?
                //                     'unsubscribe' :
                //                     'subscribe'
                //             }
                //         </Text>
                //     </TouchableOpacity>

                // </View>
                <Text>This is the personal Post page</Text>
            }
            ListEmptyComponent={
                <InfoMessage
                    title={'No Posts or comments published'}
                    message={"Publish some posts or comments and they'll show up here!"}
                />
            }
            renderItem={
                ({ item }) =>
                    <Post
                        parent={item.parent?.uuid}
                        key={item.uuid}
                        author={item.author.name}
                        course={item.course.name}
                        text={item.text}
                        time={item.time}
                        attachmentURL={item.attachmentURL}
                    />
            }
            ListFooterComponent={
                data.user.posts?.length > 0 ?
                    <View style={styles.container}>
                        <TouchableOpacity
                            onPress={
                                () => fetchMore({
                                    variables: {
                                        offset: data.user.posts?.length
                                    }
                                })
                            }
                        >
                            <Text>
                                No new posts or comments
                            </Text>
                        </TouchableOpacity>
                    </View>
                    : <></>
            }
        />
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

export default connectProps(PersonalPost);