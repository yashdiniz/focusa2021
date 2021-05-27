import { configureStore } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import { SET_TOKEN, SET_USERID, SET_USERNAME } from '../config';

export let store = configureStore({ reducer });

const initState = {
    token: '',
    username: '@@',
    userID: '',
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
        case SET_USERID: return {
            ...state,
            userID: action.userID,
        };
        default: return state;
    }
}

export const getToken = () => {
    return store.getState() ? store.getState().token : '';
}

const mapStateToProps = (state) => {
    if (!state) state = initState;
    return state;
}

export const connectProps = (component) => {
    return connect(mapStateToProps)(component);
};