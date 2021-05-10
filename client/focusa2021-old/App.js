import React from 'react';
import { ApolloProvider } from '@apollo/client';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';

import BottomNavigator from './Components/BottomNavigator';
import { apolloClient } from './interface/apollo';

const App = () => {
    return (
        <ApolloProvider client={apolloClient}>
            <NavigationContainer>
                <BottomNavigator />
            </NavigationContainer>
        </ApolloProvider>
    );
}

export default App;