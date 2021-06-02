import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { connectProps } from '../hooks/store';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

function PublishPost({ route, token }) {

    const courseID = route.params?.courseID;

    const [text,setText]=useState('');

    // const [CreatePost] = useMutation(CreatePost,{
    //     variables:{
    //         courseID,
    //         text:'',
    //         attachmentURL:'',
    //     }
    // })

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
                    <Icon
                        name='user'
                        size={24}
                        color='black'
                    />
                }
                containerStyle={{ width: Dimensions.get('screen').width - 20, marginTop:10 }}
                labelStyle={{ color: 'red' }}
                onChangeText={(x)=>setText(x)}
            />
            {
                console.log(text)
            }

            <Button
                title="Publish"
                buttonStyle={{width: 120}}
            />
        </View>
    );
}

export default connectProps(PublishPost);
