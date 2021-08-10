import { documentDirectory } from 'expo-file-system';

export const graphQLRealm = 'http://focusa.duckdns.org:1896';
export const authRealm = 'http://focusa.duckdns.org:1897';
export const filesRealm = 'http://focusa.duckdns.org:1901';

// Exporting the REDUX action types from here.
export const SET_TOKEN = 'SET_TOKEN';
export const SET_USERNAME = 'SET_USERNAME';
export const SET_USERID = 'SET_USERID';

// exporting file directories for caching
export const directory = documentDirectory + 'FOCUSA/';

// document render limit, to improve performance
export const documentLimit = 25; 