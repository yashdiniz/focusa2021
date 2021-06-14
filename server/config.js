const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const projectRoot = './';
dotenv.config({ path: path.join(projectRoot, '.env') });

const production = false;
// the realm stores the DNS/server name.
const port = process.env['port'] || 1896;   // using FOCUSA legacy port for testing.
const realm = "http://localhost:" + port;
const serviceAuthPass = process.env['authPass'] || 'development'; // password to authenticate microservice webhooks
const authPort = port + 1;
const authRealm = "http://localhost:" + authPort;
const profilePort = port + 2;
const profileRealm = "http://localhost:" + profilePort;
const coursesPort = port + 3;
const coursesRealm = "http://localhost:" + coursesPort;
const webrtcPort = 5000;
const graphiql = !production;  // essentially, run graphiql at graphql endpoint
const postPort = port + 4;
const postRealm = "http://localhost:" + postPort;
const filesPort = port + 5;
const filesRealm = "http://localhost:" + filesPort;
const libp2pPort = port + 6;
const libp2pRealm = `/ip4/127.0.0.1/tcp/${libp2pPort}/ws`; // could be /dnsaddr/notif.herokuapp.com/tcp/80/ws
// the dev secret which will be used for most crypto operations.
const secret = process.env['SECRET'] || 'FOCUSA secret is here';

const remote = process.env['REMOTEDB'];  // basic-auth remote couchDB URL

// auth-related, PBKDF arguments
const pbkdfIters = 1<<14, 
    pbkdfLen = 24, 
    pbkdfDigest = 'sha256',
    currentPasswordScheme = 'pbkdf2',
    minPasswordLength = 8,
    maxNameLength = 20,
    UUIDSize = 24,
    UUIDpattern = /^[\w.-]+$/i;
const rolePattern = /\w+/;

const keystorePath = path.join(projectRoot, 'keystore');
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
    subject: 'session', // default subject, if failed to feed
},
serviceAudience = 'microservice-auth',
JWTverifyOptions = {
    algorithms: ['RS256'],
    audience: ['react-native-app', 'microservice-auth'],
    issuer: 'FOCUSA',
    // subject: 'session',
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
    minMiscLength = 1,
    maxMiscNameLength = 40,
    maxMiscDescLength = 128,
    defaultAbout = 'Hey, I am a new User!';

// posts related
const pageLimit = 10,
    minPostBodyLength = 5,
    maxPostBodyLength = 65536;

// files related
const filesPath = path.join(projectRoot, 'filesDir/');

module.exports = { 
    port, authPort, authRealm, serviceAuthPass, webrtcPort, profilePort, profileRealm,
    projectRoot, graphiql, secret, realm, remote, postRealm, coursesPort, coursesRealm,
    JWTsignOptions, JWTverifyOptions, JWTsecret, rolePattern, serviceAudience,
    pbkdfIters, pbkdfDigest, pbkdfLen, UUIDSize, currentPasswordScheme,
    minPasswordLength, usernamePattern, maxModRolesforCourse, maxNameLength, maxMiscNameLength, maxMiscDescLength, minMiscLength,
    defaultProfilePic, defaultfullName, defaultAbout, pageLimit, postPort,
    minPostBodyLength, UUIDpattern, libp2pRealm, keystorePath, maxPostBodyLength,
    filesPath, filesPort, filesRealm,
};
