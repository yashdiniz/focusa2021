import React from 'react';
import { ApolloProvider, useQuery, gql } from '@apollo/client';
import { Picker } from '@react-native-picker/picker';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';

import BottomNavigator from './Components/BottomNavigator';
import { apolloClient } from './interface/apollo';

const App = (props) => {
    return (
        <ApolloProvider client={apolloClient}>
            <NavigationContainer>
                <BottomNavigator />
            </NavigationContainer>
        </ApolloProvider>
    );
}

export default App;