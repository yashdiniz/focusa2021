import React from 'react';
import { View, StyleSheet, } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { connectProps } from '../hooks/store';
import { logout } from '../hooks/authenticate';

function Settings({ navigation, route, token, username }) {

    const list = [
        {
            title: 'Edit Profile',
            icon: 'person-outline',
            onPress: ()=>navigation.navigate('EditProfile')
        },
        {
            title: 'Logout',
            icon: 'logout',
            onPress: ()=>logout(),
        },
    ]
    return (
        <View>

            {
                list.map((item, i) => (
                    <ListItem key={i} bottomDivider onPress={item.onPress}>
                        <Icon name={item.icon} />
                        <ListItem.Content>
                            <ListItem.Title>{item.title}</ListItem.Title>
                        </ListItem.Content>
                        <ListItem.Chevron />
                    </ListItem>
                ))
            }
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