import { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { authRealm, SET_TOKEN, SET_USERNAME, SET_USERID } from '../config';
import { store } from './store';
import { create } from 'axios';

export const auth = create({
    baseURL: authRealm,
    withCredentials: true, // enable use of cookies outside web browser
});

/**
 * 
 * @param {string} username The username to login with.
 * @param {string} password The password to login with.
 */
export const authenticate = (username, password) => {
    const [token, setToken] = useState('');

    useEffect(() => {
        auth.get('/login', {
            params: { username, password }
        }).then(res => {
            setToken(res.data.token);
            store.dispatch({ type: SET_USERID, userID: res.data.uuid });
            store.dispatch({ type: SET_TOKEN, token: res.data.token });
            store.dispatch({ type: SET_USERNAME, username: res.data.name });
            return token;
        })
            .catch(e => console.error(new Date(), 'authenticate Error', e));
    }, []);

    return token;
}

/**
 * 
 * @returns Promise with refreshed token.
 */
 export const refresh = () => {
    return auth.get('/refresh')
        .then(res => store.dispatch({ type: SET_TOKEN, token: res.data.token }))
        .catch(e => console.error(new Date(), 'refresh', e));
}

/**
 * Logout is used to invalidate the refresh token offered by the server,
 * and update the token currently in memory.
 * @returns Promise.
 */
export const logout = () => {
    return auth.get('/logout')
        .then(() => {
            store.dispatch({ type: SET_TOKEN, token: '' });
            store.dispatch({ type: SET_USERID, userID: '' });
            store.dispatch({ type: SET_USERNAME, username: '@@' });
            BackHandler.exitApp();
        })
        .catch(e => console.error(new Date(), 'logout', e));
}