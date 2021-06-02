import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { createPost, getCourseDetails } from '../constants/queries';
import { connectProps } from '../hooks/store';
import { Input, Button } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function PublishPost({ route, token, navigation }) {

    const courseID = route.params?.courseID;

    const [text, setText] = useState('');

    const [createPostfun] = useMutation(createPost, {
        // refetchQueries: getCourseDetails,
        // awaitRefetchQueries: true
        update(cache, { data: { createPost: createPostData } }) {
            cache.modify({
                fields: {
                    posts(existingPosts = []) {
                        const newPostRef = cache.writeFragment({
                            data: createPostData,
                            fragment: gql`
                                fragment posts on Post {
                                    uuid, time, text, attachmentURL,
                                    parent{
                                        uuid
                                    }, 
                                    author{
                                        uuid, name
                                    }, 
                                    course{
                                        uuid, name
                                    },
                                }
                            `
                        });
                        return [newPostRef, ...existingPosts];
                    }
                }
            })
        }
    })

    const onPublish = React.useCallback(() => {
        createPostfun({
            variables: {
                text,
                courseID,
            }
        })
        navigation.goBack();
    });

    return (
        <View style={{ alignItems: "center" }}>
            {/* <Text>This is the publish post screen</Text> */}
            {
                console.log(courseID)
            }

            <Input
                placeholder='enter text here...'
                label="Post Description"
                leftIcon={
                    <MaterialCommunityIcons name="pencil" size={24} />
                }
                containerStyle={{ width: Dimensions.get('screen').width - 20, marginTop: 10 }}
                labelStyle={{ color: 'red' }}
                onChangeText={(x) => setText(x)}
            />
            {
                console.log(text)
            }

            <Button
                title="Publish"
                buttonStyle={{ width: 120 }}
                onPress={onPublish}
            />
        </View>
    );
}

export default connectProps(PublishPost);
