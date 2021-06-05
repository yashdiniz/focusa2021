import React, { useContext, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Text, View, Dimensions, ScrollView } from 'react-native';
import { Overlay, Input, Button } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getCourseDetails, editPost} from '../constants/queries';
import { connectProps } from '../hooks/store';

function EditPostOverlay({ toggleOverlayEditPost, editPostVisible, postID, currentText, onRefresh, toggleBottomSheet }) {
    const [ text, setText ] = useState(currentText);
    const [ editPostfun ] = useMutation(editPost, {
        refetchQueries: getCourseDetails,
        awaitRefetchQueries: true, 
        onCompleted() {
            onRefresh();
        }
    });

    const onEdit = React.useCallback(() => {
        editPostfun({
            variables:{
                postID,
                text,
            }
        });
        toggleOverlayEditPost();
        toggleBottomSheet();
    })

    const onCancel = React.useCallback(() => {
        toggleOverlayEditPost();
        toggleBottomSheet();
    })

    return (
        <>
            <Overlay isVisible={editPostVisible}>
                <ScrollView contentContainerStyle={{
                    width: Dimensions.get('window').width,
                    height: Dimensions.get('window').height,
                    alignItems: 'center'
                }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginRight: 'auto' }}>Edit</Text>
                    
                    {/* Reference: https://stackoverflow.com/a/34006497/13227113 */}
                    <Input
                        placeholder='Enter text here...'
                        label='Description'
                        leftIcon={
                            <MaterialCommunityIcons name="pencil" size={24} />
                        }
                        multiline={true}
                        numberOfLines={7}
                        containerStyle={{ width: Dimensions.get('window').width, marginTop: 10 }}
                        labelStyle={{ color: 'red' }}
                        onChangeText={setText}
                        value={text}
                    />

                    {/* Action buttons */}
                    <View style={{ flexDirection: 'row', }}>
                        <Button
                            title="Save"
                            buttonStyle={{ width: 120, marginRight: 15 }}
                            disabled={(text.trim().length < 10 ? true : false)}
                            onPress={onEdit}
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

export default connectProps(EditPostOverlay);