/**
 * Keeping the strategy code here for easier localization and future upgrades.
 */

const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const { validateUser } = require('./functions');

// form values sent need to have name and pass as input values...
const localStrategy = new LocalStrategy(async (username, password, done) => {
    try {
        // on successful validation, no error will be thrown
        let user = await validateUser(username, password);
        let session = { // create a session.
            name: user.name,
            time: Date.now(),
            ip: undefined, // TODO: Add geo-ip identificatio details in session.
            token: undefined, // TODO: Also add the JWT authentication logic
        }
        return done(null, session);
    } catch(e) {
        console.error(e);   // TODO: remove the console commands once done, switch to logger
        return done(null, false, { message: 'Incorrect username or password.'})
    }
});

// const gStrategy = new GoogleStrategy({
//     returnURL: path.join(realm, '/callback'),   // options
//     realm
// }, (identifier, profile, done) => { // validate function
//     // will validate the data returned from Google Strategy code
    
//     /* TODO: sign a JWT with profile data here. */

//     profile['identifier'] = identifier;
//     return done(null, profile); // serializes the profile object into session.
// });

module.exports = {
    localStrategy
}