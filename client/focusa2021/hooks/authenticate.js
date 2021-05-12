import { create } from 'axios';
import { useEffect, useState } from 'react';
import { authRealm } from '../config';
import { graphQLToken } from './apollo';

const auth = create({
    baseURL: authRealm,
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
            console.log('authenticate', res.data.token);
            setToken(res.data.token);
            return graphQLToken(res.data.token);
        })
        .catch(e=> console.error('authenticate', e));
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
    .then(() => graphQLToken('logged out.'))
    .catch(e=> console.error('logout', e));
}