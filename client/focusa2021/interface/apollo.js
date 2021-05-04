import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/link-context';

// see: https://github.com/graphql/swapi-graphql
// Used to be 'https://swapi-graphql.netlify.app/.netlify/functions/index'
const GRAPHQL_API_URL = 'http://192.168.0.101:1896/graphql';

/*
uncomment the code below in case you are using a GraphQL API that requires some form of
authentication. asyncAuthLink will run every time your request is made and use the token
you provide while making the request.
*/
let TOKEN = '';
export const setGraphQLToken = (token) => {
  TOKEN = token;
}
const asyncAuthLink = setContext(async () => {
  return {
    headers: {
      Authorization: TOKEN,
    },
  };
});

const httpLink = new HttpLink({
  uri: GRAPHQL_API_URL,
});

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(), // can switch to another cache for offline use
  link: asyncAuthLink.concat(httpLink),
});
