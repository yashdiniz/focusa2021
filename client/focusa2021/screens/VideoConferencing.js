import { useQuery } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Avatar, Card, Button, SearchBar } from 'react-native-elements';
import { connectProps } from '../hooks/store';
import Course from '../components/Course';
import ErrorComponent from '../components/ErrorComponent';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { CourseDetailsNavigate } from '../constants/screens';
import InfoMessage from '../components/InfoMessage';

function Courses({ navigation, route, token, username }) {
    return (
        <Text>This is the video conferencing Screen.</Text>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default connectProps(Courses);