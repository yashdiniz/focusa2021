import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { apolloClient } from './hooks/apollo';
import { useQuery } from '@apollo/client';
import { getProfileData } from './queries';

export default function App() {
  const { loading, error, data } = useQuery(getProfileData, {
    variables: { username: "admin" }
  });

  return (
    <ApolloProvider apolloClient={apolloClient}>
      <View style={styles.container}>
        {
          loading ? 
            error ? (<Text>{data}</Text>) : 
              (<Text style={{color:'red'}}>{error}</Text>) :
            (<ActivityIndicator/>)
        }
        <Text>Open up App.js to start working on your app!</Text>
        <StatusBar style="auto" />
      </View>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
