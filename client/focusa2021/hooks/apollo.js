import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client';
import { setContext } from '@apollo/link-context';
import { onError } from "@apollo/client/link/error";
import { create } from 'axios';
import { graphQLRealm, authRealm, SET_TOKEN } from '../config';
import promiseToObservable from './promiseToObservable';
import { store } from './store';

export const auth = create({
    baseURL: authRealm,
    withCredentials: true, // enable use of cookies outside web browser
});

const GRAPHQL_API_URL = graphQLRealm;

/**
 * 
 * @returns Promise with refreshed token.
 */
 export const refresh = () => {
    return auth.get('/refresh')
    .then(res => graphQLToken(res.data.token))
    .catch(e=> console.error('refresh', e));
}

/**
 * Retrieves the GraphQL token value. Also allows to update the token value if necessary.
 * @param {string} token The JWT to update the current value to.
 * @return Current token value.
 */
export const graphQLToken = (token) => {
    console.log('graphQLToken', store.getState());
    if (token) store.dispatch({ type: SET_TOKEN, token });
    return store.getState()?.token;
}
const asyncAuthLink = setContext(() => {
    return {
        headers: {
            authorization: graphQLToken(),
        },
    };
});

const httpLink = new HttpLink({
    uri: GRAPHQL_API_URL,
});

const errorLink = onError(({ graphQLErrors, otherErrors, operation, forward }) => {
    if (graphQLErrors) {
        for (let err of graphQLErrors) {
            switch (err.extensions.code) {
                case 'UNAUTHENTICATED': { // if GraphQL server returns unauthenticated
                    // Modify the operation context with a new token
                    // await refresh, then call its link middleware again
                    return promiseToObservable(refresh())
                    // Retry the request, returning the new observable
                    .flatMap(() => {
                        return forward(operation);
                    });
                }
                case 'BAD_USER_INPUT':
                default: console.error('[GraphQL error]:', err);
            }
        }
    }
    if (otherErrors) {
        console.error('[Other error]:', otherErrors);
        throw otherErrors;
    }
});

export const apolloClient = new ApolloClient({
    cache: new InMemoryCache(), // TODO: switch to another cache for offline use
    link: from([errorLink, asyncAuthLink.concat(httpLink)]),
});
