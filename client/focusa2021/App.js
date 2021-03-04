import React, { Component, useState } from 'react';
import { Button, Text, View, SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';
import { ApolloProvider, useQuery, gql } from '@apollo/client';
import { Picker } from '@react-native-picker/picker';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';

import { apolloClient } from './apollo';

import BottomNavigator from './Components/BottomNavigator';

const App = (props) => {
    const [ login, setLoggedIn ] = useState('');
    return(
        <NavigationContainer>
            {/* <Stack.Navigator screenOptions={{
                headerShown: false
            }}>
                <Stack.Screen
                    name="Login"
                    component={Login}
                />
                <Stack.Screen name="Home" component={Home} />
            </Stack.Navigator> */}
            <BottomNavigator login={login} setLoggedIn={setLoggedIn} />
        </NavigationContainer>
    );
}

export default App;