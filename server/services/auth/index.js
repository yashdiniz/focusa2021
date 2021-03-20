const passport = require('passport');
const express = require('express');
const express_session = require('express-session');
const bodyParser = require('body-parser').urlencoded({ extended: true });
const cookieParser = require('cookie-parser');
const app = express();

const { authPort, secret, JWTsignOptions } = require('../../config');
const { localStrategy, refreshToken } = require('./strategy.js');
const { ensureAuthenticated } = require('./ensureAuthenticated');
const { getUserById, userExists } = require('./functions');
const jwt = require('../jwt');

process.title = 'FOCUSA authenticator service';

app.use(passport.initialize());
app.use(express_session({ 
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

app.get('/login', 
    passport.authenticate('local', 
    {
        failureRedirect: '/error',
    }),
    (req, res) => {
        res.json({
            token: req.user.token,
            login: true });
    }
);

app.get('/check', ensureAuthenticated, (req, res) => {
    res.json({ 
        cookies: req.cookies,
        name: req.user.name,
        token: req.user.token,
        match: req.user.token === req.headers.authorization,    // check a match
    });
});

app.get('/error', (req, res) => {
    // umm yes, this always returns login false, it's just an error broadcast
    res.status(401).json({ login: false, message: 'User not authenticated.' });
});

app.get('/refresh', ensureAuthenticated, (req, res) => {
    refreshToken(req);  // refresh token of the session
    res.json({
        token: req.user.token,
        login: true,
    });
});

app.get('/getUserById', (req, res) => {
    if (jwt.ensureLoggedIn(req.headers.authorization)) {
        getUserById(req.query.id)
        .then(doc => res.json({ name: doc.name, uuid: doc.uuid }))
        .catch(e => res.status(404).json({ message: 'User not found' }));
    } else res.status(407).json({ message: 'User not authenticated.' });
});

app.get('/getUserByName', (req, res) => {
    if (jwt.ensureLoggedIn(req.headers.authorization)) {
        userExists(req.query.name)
        .then(doc => res.json({ name: doc.name, uuid: doc.uuid }))
        .catch(e => res.status(404).json({ message: 'User not found' }));
    } else res.status(407).json({ message: 'User not authenticated.' });
});

app.listen(authPort, () => {
    console.warn(`Auth listening on port ${ authPort }`);
});