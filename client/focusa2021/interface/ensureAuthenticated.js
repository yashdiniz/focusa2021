import { useEffect } from 'react';
import { create } from 'axios';
import { ToastAndroid } from "react-native";
import { authRealm } from '../config';

const auth = create({
    baseURL: authRealm,
});

import { getGraphQLToken, setGraphQLToken } from '../interface/apollo';

/**
 * 
 * @param {string} username The username to login with.
 * @param {string} password The password to login with.
 * @param {string} setLoggedIn That React hook function to modify.
 */
export const authenticate = (username, password) => {
    return auth.get('/login', {
        params: { username, password }
    })
        .then(res => {
            setGraphQLToken(res.data.token);
            return getGraphQLToken();
        });
}

export const logout = () => {
    return auth.get('/logout')  // invalidate the server refresh cookie
        .then(() => {
            setGraphQLToken("");    // clear the GraphQL JWT
            return true;
        })
}

export function ensureAuthenticated(navigation, token) {
    useEffect(() => {
        // TODO: temporarily setting to bypass login
        // REMOVE THIS LINE IN PRODUCTION
        //token = "true";
        console.log('Current login state: ', token.length > 0);
        if (!token) return ToastAndroid.showWithGravityAndOffset(
            "User not Logged in. Please Login",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
        );
        //navigation.navigate('Login');
    });
}


export const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}
