import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './hooks/apollo';
import Navigation from './navigation';
import useColorScheme from './hooks/useColorScheme';

export default function App() {
  const colorScheme = useColorScheme();

  return (
    <ApolloProvider client={apolloClient}>
        <Navigation colorScheme={colorScheme} />
        <StatusBar style="auto" />
    </ApolloProvider>
  );
}