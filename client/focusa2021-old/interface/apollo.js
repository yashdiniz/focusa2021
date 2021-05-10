import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client';
import { setContext } from '@apollo/link-context';
import { onError } from "@apollo/client/link/error";
import { create } from 'axios';
import { graphQLRealm, authRealm } from '../config';

const auth = create({
  baseURL: authRealm,
});

const GRAPHQL_API_URL = graphQLRealm;

let TOKEN = '';
export const getGraphQLToken = () => {
  return TOKEN;
}
export const setGraphQLToken = (token) => {
  return (TOKEN = token);
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
        case 'UNAUTHENTICATED': { // if GraphQL server returns unauthenticated
          // Modify the operation context with a new token
          const oldHeaders = operation.getContext().headers;
          operation.setContext({
            headers: {
              ...oldHeaders,
              authorization: await auth.get('/refresh').then(res => res.data.token),
            },
          });
          // Retry the request, returning the new observable
          return forward(operation);
        }
        case 'BAD_USER_INPUT':
        default: console.error('[GraphQL error]:', err);
      }
    }
  }
  if (networkError) console.log('[Network error]:', networkError);
});

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(), // TODO: switch to another cache for offline use
  link: from([errorLink, asyncAuthLink.concat(httpLink)]),
});
