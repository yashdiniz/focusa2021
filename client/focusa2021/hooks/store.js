import { configureStore } from '@reduxjs/toolkit';
import { SET_TOKEN } from '../config';

export let store = configureStore({ reducer });

const initState = {
    token: '',
};

function reducer(state, action) {
    if (!state) state = initState;
    console.log('reducer', state, action);
    if(action.type === SET_TOKEN) {
        return {
            token: action.value,
        };
    }
    return state;
}