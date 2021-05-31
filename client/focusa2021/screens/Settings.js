import { useQuery } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Avatar, Card, Button, SearchBar, ListItem, Icon } from 'react-native-elements';
import { connectProps } from '../hooks/store';
import { logout } from '../hooks/authenticate';

function Settings({ navigation, route, token, username }) {
    return (
        //<Text>This is the settings page</Text>
        <View>
            <ListItem bottomDivider onPress={logout}>
                <Icon name='logout' />
                <ListItem.Content>
                    <ListItem.Title>Logout</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron color={"red"} />
            </ListItem>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        flex: 2,
        backgroundColor: '#333',
        margin: 20
    },
    profileText: {
        textAlign: 'center',
        color: '#789'
    }
});

export default connectProps(Settings);