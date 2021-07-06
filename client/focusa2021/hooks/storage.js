import AsyncStorage from '@react-native-async-storage/async-storage';
import CookieManager from 'react-native-cookies';
import { authRealm, SET_USERID, SET_USERNAME } from '../config';
import { store } from './store';


export function getCookie() {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('UUID', (err, result) => {
            if (err) console.error(err);
            store.dispatch({ type: SET_USERID, userID: result });
        });
        AsyncStorage.getItem('USERNAME', (err, result) => {
            if (err) console.error(err);
            store.dispatch({ type: SET_USERNAME, username: result });
        });
        AsyncStorage.getItem('COOKIE', (err, result) => {
            if (err) reject(err);
            console.log('get Cookie=>', result)
            CookieManager.setFromResponse(
                authRealm,
                result
            ).then(() => {
                CookieManager.get(authRealm)
                    .then(cookies => {
                        console.log('CookieManager.get =>', cookies['connect.sid'])
                        resolve(cookies['connect.sid']);
                        return cookies['connect.sid'];
                    })
            })
        })
    });
}

export function setCookie(cookie, uuid, name) {
    return new Promise((resolve, reject) => {
        AsyncStorage.setItem('UUID',uuid);
        AsyncStorage.setItem('USERNAME',name);
        AsyncStorage.setItem('COOKIE', cookie, (err) => {
            if (err) reject(err);
            CookieManager.setFromResponse(
                authRealm,
                cookie
            ).then(success => {
                console.log('CookieManager.setFromResponse=>', success)
            })
            resolve(cookie);
        });
    });


}

export function flushCookie() {
    CookieManager.flush()
        .then((success) => {
            console.log('CookieManager.flush =>', success);
        });
}


