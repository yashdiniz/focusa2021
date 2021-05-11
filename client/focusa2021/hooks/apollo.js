import { useState, useEffect } from 'react';
import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client';
import { setContext } from '@apollo/link-context';
import { onError } from "@apollo/client/link/error";
import { create } from 'axios';
import { graphQLRealm, authRealm } from '../config';

const auth = create({
    baseURL: authRealm,
});

const GRAPHQL_API_URL = graphQLRealm;

/**
 * Retrieves the GraphQL token value. Also allows to update the token value if necessary.
 * @param {string} token The JWT to update the current value to.
 * @return Current token value.
 */
export const graphQLToken = (token) => {
    const [TOKEN, setToken] = useState('');

    useEffect(()=>{
        if (token) setToken(token);
    }, []);

    return TOKEN;
}
const asyncAuthLink = setContext(async () => {
    return {
        headers: {
            authorization: graphQLToken(),
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
                    const token = graphQLToken(await auth.get('/refresh')
                                            .then(res => res.data.token));
                    operation.setContext({
                        headers: {
                            ...oldHeaders,
                            authorization: token,
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
