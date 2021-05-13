import { configureStore } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
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
            token: action.token,
        };
    }
    return state;
}

const mapStateToProps = (state) => {
    if (!state) state = initState;
    console.log('mapStateToProps', state);
    const { token } = state;
    return { token };
}

export const connectProps = (component) => {
    return connect(mapStateToProps)(component);
};