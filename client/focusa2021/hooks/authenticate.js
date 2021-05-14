import { useEffect, useState } from 'react';
import { SET_TOKEN } from '../config';
import { auth } from './apollo';
import { store } from './store';

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
            store.dispatch({type:SET_TOKEN, token:res.data.token});
            return token;
        })
        .catch(e=> console.error(new Date(), 'authenticate Error', e));
    }, []);

    return token;
}

/**
 * Logout is used to invalidate the refresh token offered by the server,
 * and update the token currently in memory.
 * @returns Promise.
 */
export const logout = () => {
    return auth.get('/logout')
    .then(() => store.dispatch({type:SET_TOKEN, token:''}))
    .catch(e=> console.error(new Date(), 'logout', e));
}