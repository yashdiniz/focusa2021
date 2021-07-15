import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ApolloProvider } from '@apollo/client';
import { apolloClient, auth } from './hooks/apollo';
import Navigation from './navigation';
import { Provider } from 'react-redux';
import useColorScheme from './hooks/useColorScheme';
import { store } from './hooks/store';

export default function App() {
  const colorScheme = useColorScheme();

  console.disableYellowBox = true

  return (
    <ApolloProvider client={apolloClient}>
      <Provider store={store}>
        {/* TODO: Try and see if login can be rendered conditionally here */}
        <Navigation colorScheme={colorScheme} />
        <StatusBar style="auto" />
      </Provider>
    </ApolloProvider>
  );
}