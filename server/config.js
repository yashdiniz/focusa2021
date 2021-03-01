const dotenv = require('dotenv');
dotenv.config();

const port = process.env['PORT'];   // using FOCUSA legacy port for testing.
const graphiql = process.env['PRODUCTION'] == 'false';  // essentially, run graphiql at graphql endpoint

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
const usernamePattern = /\w+/;  // almost alphanumeric pattern(URL safe)

// course-related
const maxModRolesforCourse = 2;

// profile-related
const defaultProfilePic = 'dp.jpeg';

module.exports = { 
    port, graphiql, secret, realm, remote,
    pbkdfIters, pbkdfDigest, pbkdfLen, UUIDSize, currentPasswordScheme,
    minPasswordLength, usernamePattern, maxModRolesforCourse,
    defaultProfilePic
};
