import { create } from 'axios';
import { authRealm } from '../config';
import { graphQLToken } from './apollo';

const auth = create({
    baseURL: authRealm,
});

/**
 * 
 * @param {string} username The username to login with.
 * @param {string} password The password to login with.
 * @param {string} setLoggedIn That React hook function to modify.
 */
export const authenticate = (username, password) => {
    return auth.get('/login', {
        params: { username, password }
    }).then(res => {
        return graphQLToken(res.data.token);
    });
}

/**
 * Logout is used to invalidate the refresh token offered by the server,
 * and update the token currently in memory.
 * @returns Promise.
 */
export const logout = () => {
    return auth.get('/logout')
    .then(() => {
        return graphQLToken('logged out.');
    })
}