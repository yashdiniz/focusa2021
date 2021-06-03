import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { connectProps } from '../hooks/store';
import { logout } from '../hooks/authenticate';

function Settings({ navigation, route, token, username }) {
    return (
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
});

export default connectProps(Settings);