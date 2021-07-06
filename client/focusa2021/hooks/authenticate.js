import { BackHandler,ToastAndroid } from 'react-native';
import { authRealm, SET_TOKEN, SET_USERNAME, SET_USERID } from '../config';
import CookieManager from 'react-native-cookies';
import { store } from './store';
import { create } from 'axios';
import { flushCookie, getCookie, setCookie } from './storage';

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
        // TODO: assuming index 0 is always connect.sid
        console.log('authenticate=>',res.headers['set-cookie'][0])
        setCookie(res.headers['set-cookie'][0], res.data.uuid, res.data.name);
        store.dispatch({ type: SET_USERID, userID: res.data.uuid });
        store.dispatch({ type: SET_TOKEN, token: res.data.token });
        store.dispatch({ type: SET_USERNAME, username: res.data.name });
    });
}

/**
 * 
 * @returns Promise with refreshed token.
 */
 export const refresh = async () => {
    const cookie = await getCookie();
    return auth.get('/refresh', {
        headers: { Cookie: `connect.sid=${cookie}` }
    })
        .then(res => store.dispatch({ type: SET_TOKEN, token: res.data.token }))
        .catch(e => {
            console.error(new Date(), 'refresh', e)
            throw e;
        });
}

/**
 * Logout is used to invalidate the refresh token offered by the server,
 * and update the token currently in memory.
 * @returns Promise.
 */
export const logout = async () => {
    const cookie = await getCookie();

    ToastAndroid.showWithGravityAndOffset(
        "Logging out...",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
    );

    return auth.get('/logout', {
        headers: { Cookie: `connect.sid=${cookie}` }
    })
        .then(() => {
            store.dispatch({ type: SET_TOKEN, token: '' });
            store.dispatch({ type: SET_USERID, userID: '' });
            store.dispatch({ type: SET_USERNAME, username: '@@' });
            BackHandler.exitApp();
        })
        .catch(e => console.error(new Date(), 'logout', e));
}