const passport = require('passport');
const express = require('express');
const app = express();

const ensureAuthenticated = require('./ensureAuthenticated.js');
const GoogleStrategy = require('./strategy.js');

process.title = 'FOCUSA authenticator service';

app.configure(()=> {
    app.use(passport.initialize());
    app.use(passport.session());
});

/**
 * Passport session setup.
 * To support persistent login sessions, Passport needs to be able to
 * serialize users into and deserialize users out of the session.
*/
passport.serializeUser(function(user, done) {
    done(null, user);
});  
passport.deserializeUser(function(obj, done) {
done(null, obj);
});

/**
 * Google Strategy from Passport. 
 * Also coding such that strategy can be upgraded in future.
*/ 
passport.use(GoogleStrategy);

// STUB!! TODO: create the simple frontend to serve here.
app.get('/login', 
    passport.authenticate('google', 
    {
        failureRedirect: '/login'
    }),
    (req, res) => {
        // TODO: add in the JWT transfer.
        res.json({
            token: req.user.token,
            login: true });
    }
);

app.get('/callback',
    passport.authenticate('google',
    {
        failureRedirect: '/login' 
    }),
    (req, res) => {
        res.redirect('/');
    }
)