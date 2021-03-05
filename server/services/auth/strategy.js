/**
 * Keeping the strategy code here for easier localization and future upgrades.
 */

const LocalStrategy = require('passport-local').Strategy;
const { validateUser } = require('./functions');
const jwt = require('../jwt');

// form values sent need to have name and pass as input values...
const localStrategy = new LocalStrategy({
        passReqToCallback: true,
},
async (req, username, password, done) => {
    try {
        // on successful validation, no error will be thrown
        let user = await validateUser(username, password);
        let session = { // create a session.
            name: user.name,
            time: Date.now(),
            ip: req.ip,
        };
        let token = jwt.sign(session);  // sign a JWT with session details
        session.token = token;  // add the JWT to the session
        return done(null, session); // pass the session down through callback
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