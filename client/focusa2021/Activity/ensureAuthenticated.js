import {useEffect, useState } from 'react';
import { create } from 'axios';
import { Alert } from "react-native";

const axios = create({
    baseURL: 'http://192.168.43.71:1897',
    timeout: 5000,
});

/**
 * 
 * @param {string} username The username to login with.
 * @param {string} password The password to login with.
 * @param {string} setLoggedIn That React hook function to modify.
 */
const authenticate = (username, password, setLoggedIn) => {
    return axios.get('/login', {
        params: { username, password }
    })
    .then(res => {
        console.log(res)
        setLoggedIn(res.data.token);    // set the token to the state
    });
}

function ensureAuthenticated(navigation, token) {
    useEffect(() => {
        console.log('Current login state: ',token.length>0);
        if(!token) navigation.navigate('Login');
    });
};

export { authenticate, ensureAuthenticated };