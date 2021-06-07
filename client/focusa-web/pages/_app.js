import '../styles/global.css';
import { ApolloProvider } from '@apollo/client';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../hooks/store';
import { apolloClient } from '../hooks/apollo';

// Reference: https://www.apollographql.com/blog/apollo-client/next-js/next-js-getting-started/

export default function App({ Component, pageProps }) {
    return (
        <ApolloProvider client={apolloClient}>
            <ReduxProvider store={store}>
                <Component {...pageProps} />
            </ReduxProvider>
        </ApolloProvider>
    );
}
