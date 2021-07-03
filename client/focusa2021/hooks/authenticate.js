import { BackHandler } from 'react-native';
import { authRealm, SET_TOKEN, SET_USERNAME, SET_USERID } from '../config';
import CookieManager from 'react-native-cookies';
import { store } from './store';
import { create } from 'axios';
import { getCookie, setCookie } from './storage';

// Reference: https://build.affinity.co/persisting-sessions-with-react-native-4c46af3bfd83

export const auth = create({
    baseURL: authRealm,
    withCredentials: false, // enable use of cookies outside web browser
});

/**
 * 
 * @param {string} username The username to login with.
 * @param {string} password The password to login with.
 */
export const authenticate = (username, password) => {
    return auth.get('/login', {
        params: { username, password }
    }).then(res => {
        // CookieManager.clearAll().then(() => setCookie(res.headers));
        store.dispatch({ type: SET_USERID, userID: res.data.uuid });
        store.dispatch({ type: SET_TOKEN, token: res.data.token });
        store.dispatch({ type: SET_USERNAME, username: res.data.name });
    });
}

/**
 * 
 * @returns Promise with refreshed token.
 */
 export const refresh = () => {
    const cookie = getCookie();
    return auth.get('/refresh', {
        headers: { cookie }
    })
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