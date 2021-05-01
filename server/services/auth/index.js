const passport = require('passport');
const express = require('express');
const session = require('express-session');
const LevelStore = require('express-session-level')(session);
const bodyParser = require('body-parser').urlencoded({ extended: true });
const cookieParser = require('cookie-parser');
const app = express();

const { authPort, secret, JWTsignOptions, serviceAuthPass, serviceAudience } = require('../../config');
const { localStrategy, refreshToken } = require('./strategy.js');
const { ensureAuthenticated } = require('./ensureAuthenticated');
const { getUserById, userExists, getRoleById, roleExists, getRolesOfUser, getUsersOfRole, createUser, giveRole, userHasRole, updateUser, deleteUser, createRole, deleteRole } = require('./functions');
const jwt = require('../jwt');
const { isRxDocument } = require('rxdb');

process.title = 'FOCUSA authenticator service';

app.use(passport.initialize());
const db = require('level')(__dirname + '/db');
app.use(session({
    store: new LevelStore(db),
    secret,
    cookie: {
        httpOnly: true,
        sameSite: true,
    },
    saveUninitialized: false,
    resave: false,
}));
app.use(passport.session());

app.use(bodyParser);
app.use(cookieParser());

/**
 * Passport session setup.
 * To support persistent login sessions, Passport needs to be able to
 * serialize users into and deserialize users out of the session.
*/
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((sess, done) => done(null, sess));

/**
 * Local Strategy from Passport. 
 * Also coding such that strategy can be upgraded in future.
*/
passport.use(localStrategy);

app.use(require('helmet')());

/**
 * NOTE: BASIC AUTH CHECKS THE Authorization header(for base64 username:password)
 * Creating a basic-auth endpoint to simplify 
 * microservice-microservice authorization.
 * Only microservices will use this communication method
 * to obtain JWT session tokens for microservice comms.
 * 
 * *This JWT session will offer very high privleges.*
 * TODO: Ensure ONLY microservices can authenticate through here!!
 */
app.get('/', (req, res) => {
    let user = require('basic-auth')(req);
    if (serviceAuthPass === user?.pass) {
        res.json({
            token: jwt.serviceSign({
                time: Date.now(),
                ip: req.ip,
                name: user.name,
            })
        });
    } else res.status(401).json({ message: 'microservice not authenticated.' });
});

app.get('/login',
    passport.authenticate('local',
        {
            failureRedirect: '/error',
        }),
    (req, res) => {
        res.json({
            token: req.user?.token,
            login: true
        });
    }
);

app.get('/check', ensureAuthenticated, (req, res) => {
    res.json({
        cookies: req.cookies,
        name: req.user?.name,
        token: req.user?.token,
    });
});

app.get('/error', (req, res) => {
    // umm yes, this always returns login false, it's just an error broadcast
    res.status(401).json({ login: false, message: 'User not authenticated.' });
});

app.get('/refresh', ensureAuthenticated, (req, res) => {
    refreshToken(req);  // refresh token of the session
    res.json({
        token: req.user?.token,
        login: true,
    });
});

app.get('/getUserById', jwt.ensureLoggedIn, (req, res) => {
    if (req.user) getUserById(req.query.id)
        .then(doc => res.json({ name: doc.name, uuid: doc.uuid }))
        .catch(e => res.status(404).json({ message: 'User not found.', e }));
});

app.get('/getUserByName', jwt.ensureLoggedIn, (req, res) => {
    if (req.user) userExists(req.query.name)
        .then(doc => res.json({ name: doc.name, uuid: doc.uuid }))
        .catch(e => res.status(404).json({ message: 'User not found.', e }));
});

app.get('/getRoleById', jwt.ensureLoggedIn, (req, res) => {
    if (req.user) getRoleById(req.query.id)
        .then(doc => res.json({ name: doc.name, uuid: doc.uuid }))
        .catch(e => res.status(404).json({ message: 'Role not found.', e }));
});

app.get('/getRoleByName', jwt.ensureLoggedIn, (req, res) => {
    if (req.user) roleExists(req.query.name)
        .then(doc => res.json({ name: doc.name, uuid: doc.uuid }))
        .catch(e => res.status(404).json({ message: 'Role not found.', e }));
});

app.get('/getRolesOfUser', jwt.ensureLoggedIn, (req, res) => {
    if (req.user) getRolesOfUser(req.query.name)  // user name
        .then(docs => res.json(docs.map(doc => ({ name: doc.name, uuid: doc.uuid }))))
        .catch(e => res.status(404).json({ message: 'User not found.', e }));
});

app.get('/getUsersOfRole', jwt.ensureLoggedIn, (req, res) => {
    if (req.user) getUsersOfRole(req.query.name)
        .then(docs => res.json(docs.map(doc => ({ name: doc.name, uuid: doc.uuid }))))
        .catch(e => res.status(404).json({ message: 'Role not found.', e }));
});

app.get('/userHasRole', jwt.ensureLoggedIn, (req, res) => {
    if (req.user) userHasRole(req.query.user, req.query.role)
        .then(doc => res.json({ uuid: doc.uuid, user: doc.user, role: doc.role }))
        .catch(e => res.status(404).json({ message: 'User does not have Role.', e }));
});

const isAdminUser = async (username) => {
    try {
        return isRxDocument(await userHasRole(username, 'admin'));
    } catch (e) { return false; }
}

app.get('/createUser', jwt.ensureLoggedIn, async (req, res) => {
    if (req.user?.aud === serviceAudience       // either a microservice initiated it
        ^ await isAdminUser(req.user?.name)) // or an admin did
        createUser(req.query.username, req.query.password)
            .then(doc => res.json({ name: doc.name, uuid: doc.uuid }))
            .catch(e => res.status(404).json({ e }));
    else res.status(403).json({ message: 'Operation not allowed.' });
});

app.get('/updateUser', jwt.ensureLoggedIn, async (req, res) => {
    if (req.user?.aud === serviceAudience ^         // either a microservice initiated it
        (req.user?.name === req.query.username      // or the user themselves wants to update
            || await isAdminUser(req.user?.name))) // or an admin wants to
        updateUser(req.query.username, req.query.password)
            .then(doc => res.json({ name: doc.name, uuid: doc.uuid }))
            .catch(e => res.status(404).json({ e }));
    else res.status(403).json({ message: 'Operation not allowed.' });
});

app.get('/deleteUser', jwt.ensureLoggedIn, async (req, res) => {
    if (req.user?.aud === serviceAudience       // either a microservice initiated it
        ^ await isAdminUser(req.user?.name)) // or an admin did
        deleteUser(req.query.username)
            .then(doc => res.json({ name: doc.name, uuid: doc.uuid }))
            .catch(e => res.status(404).json({ e }));
    else res.status(403).json({ message: 'Operation not allowed.' });
});

app.get('/createRole', jwt.ensureLoggedIn, async (req, res) => {
    if (req.user?.aud === serviceAudience       // either a microservice initiated it
        ^ await isAdminUser(req.user?.name)) // or an admin did
        createRole(req.query.name)
            .then(doc => res.json({ name: doc.name, uuid: doc.uuid }))
            .catch(e => res.status(404).json({ e }));
    else res.status(403).json({ message: 'Operation not allowed.' });
});

app.get('/deleteRole', jwt.ensureLoggedIn, async (req, res) => {
    if (req.user?.aud === serviceAudience       // either a microservice initiated it
        ^ await isAdminUser(req.user?.name)) // or an admin did
        deleteRole(req.query.name)
            .then(doc => res.json({ name: doc.name, uuid: doc.uuid }))
            .catch(e => res.status(404).json({ e }));
    else res.status(403).json({ message: 'Operation not allowed.' });
});

app.get('/giveRole', jwt.ensureLoggedIn, async (req, res) => {
    if (req.user?.aud === serviceAudience         // either a microservice initiated it
        ^ await isAdminUser(req.user?.name)) // or an admin did
        giveRole(req.query.role, req.query.username)
            .then(doc => res.json({ user_roleID: doc.user_roleID, user: doc.user, role: doc.role }))
            .catch(e => res.status(404).json({ e }));
    else res.status(403).json({ message: 'Operation not allowed.' });
});

// used to ensure that notification pubsub service has consistent addresses...
let addrs = [];
function waitForAddrs(condition) {
    const poll = resolve => {
        if (condition()) resolve(addrs);
        else setTimeout(_ => poll(resolve), 500);
    }
    return new Promise(poll);
}
app.get('/PubSubpeerIds', jwt.ensureLoggedIn, (req, res) => {
    if (req.user?.aud === serviceAudience)
        waitForAddrs(() => (addrs.length > 0)).then(_ => res.json({ addrs }));
    else res.redirect('/error');
});

app.get('/AddPubSubpeerIds', jwt.ensureLoggedIn, (req, res) => {
    if (req.user?.aud === serviceAudience && typeof req.query?.addrs === 'object') {
        addrs = req.query.addrs;
        res.json(true);
    } else res.redirect('/error');
});

app.listen(authPort, () => {
    console.warn(`Auth listening on port ${authPort}`);
});