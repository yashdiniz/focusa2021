import React, {Component } from 'react';
import { Button, Text, View, SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';
import { ApolloProvider, useQuery, gql } from '@apollo/client';
import { Picker } from '@react-native-picker/picker';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { apolloClient } from './apollo';

import Login from './Activity/Login';
import Home from './Activity/Home';

const Stack = createStackNavigator();

class App extends Component{
    render(){
        return(
            <NavigationContainer>
                <Stack.Navigator screenOptions={{
                    headerShown: false
                }}>
                    <Stack.Screen
                        name="Login"
                        component={Login}
                    />
                    <Stack.Screen name="Home" component={Home} />
                </Stack.Navigator>
            </NavigationContainer>
            
        );
    }
}


export default App;