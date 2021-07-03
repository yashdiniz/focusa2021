import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Text, View, Dimensions, ScrollView, Linking, ActivityIndicator } from 'react-native';
import { Overlay, Input, Button } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getCourseDetails, createPost } from '../constants/queries';
import { connectProps } from '../hooks/store';
import { uploadFile } from '../hooks/FileSystem';

function PublishOverlay({ onRefresh, courseID, toggleOverlayPublishPost, publishPostVisible, parentID }) {
    const [uploading, setUploading] = useState(false);
    const [uploaded, setUploaded]=useState('');
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
                parentID,
                attachmentURL: uploaded,
            }
        });
        toggleOverlayPublishPost();
        setUploaded('');
    });

    const onUpload = React.useCallback(()=>{
        setUploading(true); // show the activity indicator
        uploadFile()
        .then(res => {
            let body = JSON.parse(res.body);
            setUploading(false);    // stop showing the activity indicator
            let hash = body.path;
            let name = body.name;
            console.log(hash && name);
            let url = hash && name ? `/ipfs?cid=${hash}&name=${name}` : '';

            res && url ? setUploaded(url) : null;
            console.log(res);
        });
    })

    const onCancel = React.useCallback(()=>{
        toggleOverlayPublishPost();
        setUploading(false);
        setUploaded('');
    })

    return (
        <>
            <Overlay isVisible={publishPostVisible}>
                <ScrollView contentContainerStyle={{
                    width: Dimensions.get('window').width,
                    height: Dimensions.get('window').height,
                    alignItems: 'center'
                }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginRight: 'auto' }}>Publish</Text>
                    <Input
                        placeholder='Enter text here...'
                        label="Description"
                        leftIcon={
                            <MaterialCommunityIcons name="pencil" size={24} />
                        }
                        multiline={true}
                        numberOfLines={7}
                        containerStyle={{ width: Dimensions.get('window').width, marginTop: 10 }}
                        labelStyle={{ color: 'red' }}
                        onChangeText={setText}
                    />
                    {
                        uploading ?
                        <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                            <ActivityIndicator  color={'#333'} />
                        </View>
                        :
                        <View style={{ flexDirection: 'row', }}>
                        {
                              (uploaded ? <Text style={{marginBottom: 20}}>File attached Successfully.</Text> :                      
                                  <Button
                                     title="Upload"
                                     buttonStyle={{ width: 255, marginBottom: 20 }}
                                     onPress={onUpload}
                                 />)
                        }
                        </View>
                    }
                    <View style={{ flexDirection: 'row', }}>
                        <Button
                            title="Publish"
                            buttonStyle={{ width: 120, marginRight: 15 }}
                            onPress={onPublish}
                            disabled={(text.trim().length < 10 ? true : false)}
                        />
                        <Button
                            title="Cancel"
                            buttonStyle={{ width: 120, backgroundColor: 'red' }}
                            onPress={onCancel}
                        />
                    </View>

                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: 30
                    }}>
                        <MaterialCommunityIcons name="language-markdown-outline" size={30} />
                        <Text style={{ color:'gray' }}>
                            Posts also support Markdown!
                        </Text>
                        <Text style={{ color:'blue', textDecorationLine: 'underline' }}
                            onPress={() => Linking.openURL('https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet')}
                        >
                            Click here to learn more.
                        </Text>
                    </View>
                </ScrollView>
            </Overlay>
        </>
    );
}

export default connectProps(PublishOverlay);