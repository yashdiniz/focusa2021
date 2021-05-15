import { configureStore } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import { SET_TOKEN, SET_USERNAME } from '../config';

export let store = configureStore({ reducer });

const initState = {
    token: '',
    username: '@@'
};

function reducer(state, action) {
    if (!state) state = initState;
    console.log(new Date(), action.type);
    switch(action.type) {
        case SET_TOKEN: return {
            ...state,
            token: action.token,
        };
        case SET_USERNAME: return {
            ...state,
            username: action.username,
        };
        default: return state;
    }
}

export const getToken = () => {
    return store.getState() ? store.getState().token : '';
}

const mapStateToProps = (state) => {
    if (!state) state = initState;
    const { token, username } = state;
    return { token, username };
}

export const connectProps = (component) => {
    return connect(mapStateToProps)(component);
};