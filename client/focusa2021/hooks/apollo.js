import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client';
import { setContext } from '@apollo/link-context';
import { onError } from "@apollo/client/link/error";
import { graphQLRealm } from '../config';
import promiseToObservable from './promiseToObservable';
import { getToken } from './store';
import typePolicies from '../constants/typePolicies';
import { refresh } from './authenticate';

const GRAPHQL_API_URL = graphQLRealm;

const asyncAuthLink = setContext(() => {
    return {
        headers: {
            authorization: `Bearer ${getToken()}`,
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
                default: console.error(new Date(), '[GraphQL error]:', err);
            }
        }
    }
    if (otherErrors) {
        console.error(new Date(), '[Other error]:', otherErrors);
        throw otherErrors;
    }
});

export const apolloClient = new ApolloClient({
    cache: new InMemoryCache({ typePolicies }), // TODO: switch to another cache for offline use
    link: from([errorLink, asyncAuthLink, httpLink]),
});
