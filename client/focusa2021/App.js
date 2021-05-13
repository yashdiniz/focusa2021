import React from 'react';
import { AppRegistry } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './hooks/apollo';
import Navigation from './navigation';
import { Provider } from 'react-redux';
import useColorScheme from './hooks/useColorScheme';
import { store } from './hooks/store';

export default function App() {
  const colorScheme = useColorScheme();

  return (
    <ApolloProvider client={apolloClient}>
      <Provider store={store}>
        <Navigation colorScheme={colorScheme} />
        <StatusBar style="auto" />
      </Provider>
    </ApolloProvider>
  );
}

AppRegistry.registerComponent('FOCUSA', () => App);