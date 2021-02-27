import React, {Component } from 'react';
import { Button, Text, View, SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';
import { ApolloProvider, useQuery, gql } from '@apollo/client';
import { Picker } from '@react-native-picker/picker';

import { apolloClient } from './apollo';

import Login from './Activity/Login';

class App extends Component{
    render(){
        return(
            <Login/>
        );
    }
}


export default App;