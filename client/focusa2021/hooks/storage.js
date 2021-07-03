import AsyncStorage from '@react-native-async-storage/async-storage';
import CookieManager from 'react-native-cookies';

export function getCookie() {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('COOKIE', (err, result) => {
            if (err) reject(err);

            resolve(result);
        })
    });
}

export function setCookie(cookie) {
    return new Promise((resolve, reject) => {
        AsyncStorage.setItem('COOKIE', cookie, (err) => {
            if (err) reject(err);

            resolve(cookie);
        });
    });
}