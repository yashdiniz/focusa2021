import {useEffect} from 'react';
import { Alert } from "react-native";

function ensureAuthenticated(navigation, login) {
    useEffect(() => {
        console.log('this is the login state',login);
        if(!login) {
            navigation.navigate('Login');
        }
    });
}

export { ensureAuthenticated };