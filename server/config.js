const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const projectRoot = './';
dotenv.config({ path: path.join(projectRoot, '.env') });

const production = false;
// the realm stores the DNS/server name.
const realm = process.env['REALM'];
const port = process.env['port'] || 1896;   // using FOCUSA legacy port for testing.
const authRealm = "http://localhost:1897";
const serviceAuthPass = process.env['authPass']; // password to authenticate microservice webhooks
const authPort = port + 1;
const webrtcPort = 5000;
const graphiql = !production;  // essentially, run graphiql at graphql endpoint

// the dev secret which will be used for most crypto operations.
const secret = process.env['SECRET'];

const remote = process.env['REMOTEDB'];  // basic-auth remote couchDB URL

// auth-related, PBKDF arguments
const pbkdfIters = 1<<14, 
    pbkdfLen = 24, 
    pbkdfDigest = 'sha256',
    currentPasswordScheme = 'pbkdf2',
    minPasswordLength = 8,
    maxNameLength = 20,
    UUIDSize = 24;
const rolePattern = /\w+/;

if (!fs.existsSync(path.join(projectRoot, 'certs/certificate.pem'))) {
    // generates the certificates by invoking script, if not already made
    const { execSync } = require('child_process');
    execSync('bash ./generateCerts.sh < ./certinputs');
}
const JWTsignOptions = {
    algorithm: 'RS256',
    expiresIn: 300, // 5 minutes
    notBefore: 0,   // available from current timestamp
    audience: 'react-native-app',
    issuer: 'FOCUSA',
    subject: 'graphql',
},
serviceAudience = 'microservice-auth',
JWTverifyOptions = {
    algorithms: ['RS256'],
    audience: ['react-native-app', 'microservice-auth'],
    issuer: 'FOCUSA',
    subject: ['graphql', 'microservice'],
},
JWTsecret = {
    public:  fs.readFileSync(path.join(projectRoot, 'certs/certificate.pem')),
    private: fs.readFileSync(path.join(projectRoot, 'certs/key.pem')),
};
const usernamePattern = /\w+/;  // almost alphanumeric pattern(URL safe)

// course-related
const maxModRolesforCourse = 2;

// profile-related
const defaultProfilePic = 'dp.jpeg',
    defaultfullName = 'User Profile Name',
    defaultAbout = 'Hey, I am a new User!';

module.exports = { 
    port, authPort, authRealm, serviceAuthPass, webrtcPort,
    projectRoot, graphiql, secret, realm, remote, 
    JWTsignOptions, JWTverifyOptions, JWTsecret, rolePattern, serviceAudience,
    pbkdfIters, pbkdfDigest, pbkdfLen, UUIDSize, currentPasswordScheme,
    minPasswordLength, usernamePattern, maxModRolesforCourse, maxNameLength,
    defaultProfilePic, defaultfullName, defaultAbout
};
