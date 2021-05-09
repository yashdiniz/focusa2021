import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client';
import { setContext } from '@apollo/link-context';
import { onError } from "@apollo/client/link/error";
import { create } from 'axios';
import { graphQLRealm, authRealm } from '../config';

const auth = create({
  baseURL: authRealm,
});

// see: https://github.com/graphql/swapi-graphql
// Used to be 'https://swapi-graphql.netlify.app/.netlify/functions/index'
const GRAPHQL_API_URL = graphQLRealm;
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
      authorization: TOKEN,
    },
  };
});

const httpLink = new HttpLink({
  uri: GRAPHQL_API_URL,
});

const errorLink = onError(async ({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      switch (err.extensions.code) {
        // Apollo Server sets code to UNAUTHENTICATED
        // when an AuthenticationError is thrown in a resolver
        case 'UNAUTHENTICATED': {
          // Modify the operation context with a new token
          const oldHeaders = operation.getContext().headers;
          operation.setContext({
            headers: {
              ...oldHeaders,
              authorization: await auth.get('/refresh').then(res=>res.data.token),
            },
          });
          // Retry the request, returning the new observable
          return forward(operation);
        }
        default: console.error(`[GraphQL error]: ${JSON.stringify(err)}`);
      }
    }
  }
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(), // TODO: switch to another cache for offline use
  link: from([errorLink, asyncAuthLink.concat(httpLink)]),
});
