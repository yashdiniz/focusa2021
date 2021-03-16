import {useEffect } from 'react';
import { create } from 'axios';
import {setgraphQLToken} from '../apollo';

const axios = create({
    baseURL: 'http://focusa-auth.herokuapp.com',
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
        console.log('Login Token: ', res.data.token);
        setLoggedIn(res.data.token);    // set the token to the state
        setgraphQLToken(res.data.token);
    });
}

function ensureAuthenticated(navigation, token) {
    useEffect(() => {
        console.log('Current login state: ',token.length>0);
        if(!token) return navigation.navigate('Login');
    });
}

export { authenticate, ensureAuthenticated };