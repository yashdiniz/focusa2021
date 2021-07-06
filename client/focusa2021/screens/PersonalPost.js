import { useQuery } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View, StyleSheet, RefreshControl, Dimensions, TouchableOpacity } from 'react-native';
import { connectProps } from '../hooks/store';
import { personalPosts } from '../constants/queries';
import Post from '../components/Post';
import { FlatList } from 'react-native-gesture-handler';
import ErrorComponent from '../components/ErrorComponent';
import InfoMessage from '../components/InfoMessage';
import { refresh } from '../hooks/authenticate';

function PersonalPost({ navigation, route, token, username }) {
    username = route.params?.username ? // the screen will show posts based on username of profile.
        route.params.username : username;   // default is taken from redux store

    const [refreshing, setRefreshing] = useState(false);

    const { data, error, loading, refetch, fetchMore } = useQuery(personalPosts, {
        variables: {
            username,
            offset: 0,
        },
        fetchPolicy: 'no-cache'
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
        if (!token || token.length < 20) refresh()
            .catch(() => navigation.navigate('Login'));
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
        return (<ErrorComponent error={error} refresh={onRefresh} />);

    return (
        <FlatList
            containerStyle={styles.container}
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
                        uuid={item.uuid}
                        author={item.author.name}
                        course={item.course?.name}
                        text={item.text}
                        time={item.time}
                        attachmentURL={item.attachmentURL}
                        navigation={navigation}
                        onRefresh={onRefresh}
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
});

export default connectProps(PersonalPost);