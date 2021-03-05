import {useEffect} from 'react';
import { Alert } from "react-native";

function ensureAuthenticated(navigation, login) {
    useEffect(() => {
        if(!login) {
            navigation.navigate('Login');
        }
    });
}

export { ensureAuthenticated };