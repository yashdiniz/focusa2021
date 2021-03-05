const passport = require('passport');
const express = require('express');
const express_session = require('express-session');
const app = express();

const { authPort, secret } = require('../../config');
const { localStrategy } = require('./strategy.js');
const { ensureAuthenticated } = require('./ensureAuthenticated');

process.title = 'FOCUSA authenticator service';

app.use(passport.initialize());
app.use(express_session({ 
    secret,
    saveUninitialized: false,
    resave: false,
}));
app.use(passport.session());

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

app.get('/login', 
    passport.authenticate('local', 
    {
        failureRedirect: '/error',
    }),
    (req, res) => {
        // TODO: add in the JWT transfer too.
        res.json({ 
            name: req.user.name,
            token: req.user.token,
            login: true });
    }
);

app.get('/check', ensureAuthenticated, (req, res) => {
    res.json({ 
        name: req.user.name,
        token: req.user.token,
    });
});

app.get('/error', (req, res) => {
    // umm yes, this always returns login false, it's just an error hook
    res.status(401).json({ login: false, message: 'User not authenticated.' });
});

app.listen(authPort, () => {
    console.warn(`Auth listening on port ${ authPort }`);
});