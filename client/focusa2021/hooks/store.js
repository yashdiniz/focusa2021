import { configureStore } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import { SET_TOKEN } from '../config';

export let store = configureStore({ reducer });

const initState = {
    token: '',
};

function reducer(state, action) {
    if (!state) state = initState;
    if(action.type === SET_TOKEN) {
        console.log(SET_TOKEN)
        return {
            token: action.token,
        };
    }
    return state;
}

export const getToken = () => {
    return store.getState() ? store.getState().token : '';
}

const mapStateToProps = (state) => {
    if (!state) state = initState;
    const { token } = state;
    return { token };
}

export const connectProps = (component) => {
    return connect(mapStateToProps)(component);
};