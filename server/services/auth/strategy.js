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
            uuid: user.uuid,
            name: user.name,
            time: Date.now(),
            ip: req.ip,
        };
        let token = jwt.sign(session);  // sign a JWT with session details
        session.token = token;  // add the JWT to the session
        return done(null, session); // pass the session down through callback
    } catch(e) {
        console.error(new Date(), e);   // TODO: remove the console commands once done, switch to logger
        return done(null, false, { message: 'Incorrect username or password.'})
    }
});

/**
 * Refreshes the session by issuing a new JWT token.
 * @param {object} session The session data.
 */
const refreshToken = (req) => {
    let session = {
        uuid: req.user.uuid,
        name: req.user.name,
        time: req.user.time,    // do not refresh time! Will determine time since login
        ip:   req.ip            // update the IP
    }
    return (req.user.token = jwt.sign(session));
}

module.exports = {
    localStrategy, refreshToken
}