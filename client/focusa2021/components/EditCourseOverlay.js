import React, { useContext, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Text, View, Dimensions, ScrollView } from 'react-native';
import { Overlay, Input, Button } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { updateCourse,getCourseDetails } from '../constants/queries';
import { connectProps } from '../hooks/store';

function EditCourseOverlay({ toggleOverlayEditCourse, editCourseVisible, courseID, name, description, onRefresh, toggleBottomSheet, userID }) {
    const [courseName, setCourseName] = useState('' + name);
    const [courseDescription, setCourseDescription] = useState('' + description);
    const [ updateCoursefun ] = useMutation(updateCourse, {
        refetchQueries: [{
            query: getCourseDetails,
            variables: { userID, courseID, offset: 0 }
        }],
        awaitRefetchQueries: true, 
        onCompleted() {
            onRefresh();
        }
    });


    const onEdit = React.useCallback(() => {
        updateCoursefun({
            variables: {
                courseID,
                name: courseName,
                description: courseDescription,
            }
        });
        toggleOverlayEditCourse();
        toggleBottomSheet();
    })

    const onCancel = React.useCallback(() => {
        toggleOverlayEditCourse();
        toggleBottomSheet();
        setCourseName(''+name)
        setCourseDescription(''+description)
    })

    return (
        <>
            <Overlay isVisible={editCourseVisible}>
                <ScrollView contentContainerStyle={{
                    width: Dimensions.get('window').width,
                    height: Dimensions.get('window').height,
                    alignItems: 'center'
                }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginRight: 'auto' }}>Edit</Text>

                    {/* Reference: https://stackoverflow.com/a/34006497/13227113 */}
                    <Input
                        placeholder='Enter course name..'
                        label='Course name'
                        leftIcon={
                            <MaterialCommunityIcons name="pencil" size={24} />
                        }
                        containerStyle={{ width: Dimensions.get('window').width, marginTop: 10 }}
                        labelStyle={{ color: 'red' }}
                        onChangeText={setCourseName}
                        value={courseName}
                    />

                    <Input
                        placeholder='Enter description'
                        label='Description'
                        leftIcon={
                            <MaterialCommunityIcons name="pencil" size={24} />
                        }
                        multiline={true}
                        numberOfLines={4}
                        containerStyle={{ width: Dimensions.get('window').width, marginTop: 10 }}
                        labelStyle={{ color: 'red' }}
                        onChangeText={setCourseDescription}
                        value={courseDescription}
                    />

                    {/* Action buttons */}
                    <View style={{ flexDirection: 'row', }}>
                        <Button
                            title="Save"
                            buttonStyle={{ width: 120, marginRight: 15 }}
                            disabled={(courseName.trim().length < 1 || courseDescription.trim().length < 2 || courseDescription.trim().length > 120 || courseName.trim().length > 40  ? true : false)}
                            onPress={onEdit}
                        />
                        <Button
                            title="Cancel"
                            buttonStyle={{ width: 120, backgroundColor: 'red' }}
                            onPress={onCancel}
                        />
                    </View>
                </ScrollView>
            </Overlay>
        </>
    );
}

export default connectProps(EditCourseOverlay);