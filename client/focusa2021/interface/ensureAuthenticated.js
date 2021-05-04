import {useEffect } from 'react';
import { create } from 'axios';
import { Alert } from "react-native";
import { gql } from '@apollo/client';

const auth = create({
    baseURL: 'http://192.168.0.101:1897',
});

import { apolloClient, setGraphQLToken } from '../interface/apollo';

/**
 * 
 * @param {string} username The username to login with.
 * @param {string} password The password to login with.
 * @param {string} setLoggedIn That React hook function to modify.
 */
const authenticate = (username, password, setLoggedIn) => {
    return auth.get('/login', {
        params: { username, password }
    })
    .then(res => {
        setLoggedIn(res.data.token);    // set the token to the state
        setGraphQLToken(res.data.token);

        return apolloClient.query({ query: gql`{token}`})
        .then(console.log).catch(console.error);
    });
}

function ensureAuthenticated(navigation, token) {
    useEffect(() => {
        // TODO: temporarily setting to bypass login
        // REMOVE THIS LINE IN PRODUCTION
        //token = "true";

        console.log('Current login state: ',token.length>0);
        if(!token) return navigation.navigate('Login');
    });
}

export { authenticate, ensureAuthenticated };