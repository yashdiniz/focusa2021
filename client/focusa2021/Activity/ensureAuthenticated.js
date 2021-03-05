import {useEffect, useState } from 'react';
import { create } from 'axios';
import { Alert } from "react-native";

const axios = create({
    baseURL: 'http://localhost:1897',
    timeout: 5000,
    headers: {'Authorization': 'Bearer ' + token }
});

function authenticate(username, password) {
    axios.get('/login', {
        params: { username, password }
    });
}

function ensureAuthenticated(navigation, login) {
    const [ token, setToken ] = useState('');
    useEffect(() => {
        console.log('Current login state: ',login);
        if(!login) {
            navigation.navigate('Login');
        }
    });
};

export { url, ensureAuthenticated };