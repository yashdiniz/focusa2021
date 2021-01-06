/**
 * Keeping the strategy code here for easier localization and future upgrades.
 */

const GoogleStrategy = require('passport-google').Strategy;
const path = require('path');
const { realm } = require('../../config.js');
const jwt = require('jsonwebtoken');

const gStrategy = new GoogleStrategy({
    returnURL: path.join(realm, '/callback'),   // options
    realm
}, (identifier, profile, done) => { // validate function
    // will validate the data returned from Google Strategy code
    
    /* TODO: sign a JWT with profile data here. */

    profile['identifier'] = identifier;
    return done(null, profile); // serializes the profile object into session.
});

module.exports = gStrategy;