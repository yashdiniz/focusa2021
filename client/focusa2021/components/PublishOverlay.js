import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Text, View, Dimensions, ScrollView } from 'react-native';
import { Overlay, Input, Button, FAB } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getCourseDetails, createPost, getUserRole } from '../constants/queries';
import { connectProps } from '../hooks/store';

function PublishOverlay({ onRefresh, courseID, toggleOverlayPublishPost, publishPostVisible }) {
    const [text, setText] = useState('');

    const [createPostfun] = useMutation(createPost, {
        refetchQueries: getCourseDetails,
        awaitRefetchQueries: true,
        onCompleted() {
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

    return (
        <>
            <Overlay isVisible={publishPostVisible}>
                <ScrollView contentContainerStyle={{
                    width: Dimensions.get('window').width,
                    height: Dimensions.get('window').height,
                    alignItems: 'center'
                }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginRight: 'auto' }}>Publish Post</Text>
                    <Input
                        placeholder='enter text here...'
                        label="Post Description"
                        leftIcon={
                            <MaterialCommunityIcons name="pencil" size={24} />
                        }
                        multiline={true}
                        numberOfLines={7}
                        containerStyle={{ width: Dimensions.get('window').width, marginTop: 10 }}
                        labelStyle={{ color: 'red' }}
                        onChangeText={setText}
                    />
                    <View style={{ flexDirection: 'row', }}>
                        <Button
                            title="Publish"
                            buttonStyle={{ width: 120, marginRight: 15 }}
                            onPress={onPublish}
                        />
                        <Button
                            title="Cancel"
                            buttonStyle={{ width: 120, backgroundColor: 'red' }}
                            onPress={toggleOverlayPublishPost}
                        />
                    </View>
                </ScrollView>
            </Overlay>
        </>
    );
}

export default connectProps(PublishOverlay);