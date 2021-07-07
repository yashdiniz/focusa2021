import { useMutation, useQuery } from '@apollo/client';
import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, Dimensions, ActivityIndicator } from 'react-native';
import { getProfileData, updateProfile } from '../constants/queries';
import { connectProps } from '../hooks/store';
import { Input, Button } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ProfileNavigate } from '../constants/screens';
import { refresh } from '../hooks/authenticate';

function EditProfile({ route, token, navigation, username, userID }) {
    const { data, error, loading } = useQuery(getProfileData, {
        variables: {
            username
        },
        fetchPolicy: 'no-cache',
        onCompleted() {
            setFullName(data.user?.profile.fullName);
            setAbout(data.user?.profile.about);
        }
    });

    const [updateProfilefun] = useMutation(updateProfile, {
        refetchQueries: {
            query: getProfileData,
            variables: { username }
        },
        awaitRefetchQueries: true,
    });

    const onSave = useCallback(() => {
        updateProfilefun({
            variables: {
                userID,
                fullName,
                about,
            },
            optimisticResponse: {
                userID,
                fullName,
                about
            }
        });
        navigation.navigate('Profile', ProfileNavigate);
    });

    useEffect(() => {
        // if JWT is too short, it is usually because it is invalid.
        if (!token || token.length < 20) refresh()
            .catch(() => navigation.navigate('Login'));
        if (error) {
            console.error(new Date(), 'EditProfile', JSON.stringify(error));
        }
    });

    const [fullName, setFullName] = useState('');
    const [about, setAbout] = useState('');

    if (loading)
        return (
            <View>
                <ActivityIndicator color={'#333'} />
            </View>
        );
    return (
        <View style={{ alignItems: "center" }}>
            <Input
                placeholder='Enter your full name'
                label="Full name"
                leftIcon={
                    <MaterialCommunityIcons name="pencil" size={24} />
                }
                containerStyle={{ width: Dimensions.get('screen').width - 20, marginTop: 10 }}
                labelStyle={{ color: 'red' }}
                onChangeText={setFullName}
                value={fullName}
            />

            <Input
                placeholder='Enter your about'
                label="About"
                leftIcon={
                    <MaterialCommunityIcons name="pencil" size={24} />
                }
                containerStyle={{ width: Dimensions.get('screen').width - 20, marginTop: 10 }}
                labelStyle={{ color: 'red' }}
                multiline={true}
                numberOfLines={3}
                onChangeText={setAbout}
                value={about}
            />

            <View style={{ flexDirection: 'row' }}>
                <Button
                    title="Update Profile"
                    buttonStyle={{ width: 120, marginRight: 15 }}
                    onPress={onSave}
                    disabled={(fullName.trim().length < 0) ? true : false}
                />

                <Button
                    title="Cancel"
                    buttonStyle={{ width: 120, backgroundColor: 'red' }}
                    onPress={() => navigation.goBack()}
                />
            </View>
            <Text style={{color:'grey', padding:15}}>NOTE: Profile updates will take some time to reflect across all users.</Text>
        </View>
    );
}

export default connectProps(EditProfile);
