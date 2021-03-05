const dotenv = require('dotenv');

const projectRoot = '/home/yash/Desktop/focusa-new/server';
dotenv.config({ path: projectRoot + '/.env' });

const production = false;
const port = 1896;   // using FOCUSA legacy port for testing.
const authPort = port + 1;
const graphiql = !production;  // essentially, run graphiql at graphql endpoint

// the dev secret which will be used for most crypto operations.
const secret = process.env['SECRET'];

// the realm stores the DNS/server name.
const realm = process.env['REALM'];

const remote = 'http://admin:admin@localhost:5984/';  // remote couchDB URL

// auth-related, PBKDF arguments
const pbkdfIters = 1<<14, 
    pbkdfLen = 24, 
    pbkdfDigest = 'sha256',
    currentPasswordScheme = 'pbkdf2',
    minPasswordLength = 8,
    UUIDSize = 24;

const JWTsignOptions = {
    algorithm: 'ES256',
    expiresIn: 300, // 5 minutes
    audience: 'react-native-app',
    issuer: 'FOCUSA',
},
JWTverifyOptions = {
    algorithms: ['ES256'],
    audience: 'react-native-app',
    issuer: 'FOCUSA',
    maxAge: '300s',
},
JWTSecret = {
    
};
const usernamePattern = /\w+/;  // almost alphanumeric pattern(URL safe)
const sessionMaxAge = 5 * 60 * 1000;

// course-related
const maxModRolesforCourse = 2;

// profile-related
const defaultProfilePic = 'dp.jpeg';

module.exports = { 
    port, authPort, sessionMaxAge,
    projectRoot, graphiql, secret, realm, remote, JWTsignOptions, JWTverifyOptions,
    pbkdfIters, pbkdfDigest, pbkdfLen, UUIDSize, currentPasswordScheme,
    minPasswordLength, usernamePattern, maxModRolesforCourse,
    defaultProfilePic
};
