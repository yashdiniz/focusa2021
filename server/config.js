const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const projectRoot = '/home/yash/Desktop/focusa-new/server';
dotenv.config({ path: path.join(projectRoot, '.env') });

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
    algorithm: 'RS256',
    expiresIn: 300, // 5 minutes
    notBefore: 0,   // available from current timestamp
    audience: 'react-native-app',
    issuer: 'FOCUSA',
    subject: 'graphql',
},
JWTverifyOptions = {
    algorithms: ['RS256'],
    audience: 'react-native-app',
    issuer: 'FOCUSA',
    subject: 'graphql',
},
JWTsecret = {
    public:  fs.readFileSync(path.join(projectRoot, 'certs/certificate.pem')),
    private: fs.readFileSync(path.join(projectRoot, 'certs/key.pem')),
};
const usernamePattern = /\w+/;  // almost alphanumeric pattern(URL safe)

// course-related
const maxModRolesforCourse = 2;

// profile-related
const defaultProfilePic = 'dp.jpeg';

module.exports = { 
    port, authPort,
    projectRoot, graphiql, secret, realm, remote, 
    JWTsignOptions, JWTverifyOptions, JWTsecret,
    pbkdfIters, pbkdfDigest, pbkdfLen, UUIDSize, currentPasswordScheme,
    minPasswordLength, usernamePattern, maxModRolesforCourse,
    defaultProfilePic
};
