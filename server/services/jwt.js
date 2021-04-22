const { JWTsignOptions, JWTverifyOptions, JWTsecret, serviceAudience } = require('../config');
const jwt = require('jsonwebtoken');
const { assert } = require('./databases');

/**
 * Signs a token using JWT.
 * @param {object} payload The other session information stored in payload.
 */
const sign = (payload) => {
    // TODO: payload.name and subject are the same value.
    // Reduce the overall token size by removing the 'redundancy'.
    // Keep subject only. Also, make changes to verify so that 
    // payload.name = subject (since modules directly access payload.name)
    return jwt.sign(payload, JWTsecret.private, {
        ...JWTsignOptions,
        subject: payload.name,  // setting the subject based on payload name
    });
};

/**
 * Signs a token using JWT, used exclusively for service-service communication.
 * @param {object} payload The other session information stored in payload.
 */
 const serviceSign = (payload) => {
    return jwt.sign(payload, JWTsecret.private, {
        ...JWTsignOptions,
        audience: serviceAudience,
        expiresIn: 360,
        subject: payload.name,  // setting the subject based on payload name
    });
};

/**
 * Verifies and returns the payload of the JWT token.
 * @param {string} token The JWT token to verify.
 */
const verify = (token) => {
    return jwt.verify(token, JWTsecret.public, {
        ...JWTverifyOptions, 
        algorithms: JWTverifyOptions.algorithms,
    });
};

/**
 * Verifies the token, and logs on failure.
 * @param {string} token The JWT token to verify.
 */
const loginCheck = (token) => {
    assert(typeof token === 'string',
    "Invalid arguments for loginCheck.");
    token = token.replace('Bearer ', '');
    try {
        return verify(token);
    } catch(e) {
        console.log(e);
        return false;
    }
};

/**
 * Authenticator middleware. Goes next on success.
 */
const ensureLoggedIn = (req, res, next) => {
    let payload = loginCheck(req.headers?.authorization);
    if (payload && (payload.aud === serviceAudience 
        || req.ip === payload.ip 
        || req.headers?.realip === payload.ip)) {
        req.user = payload;
        next();
    }
    else res.status(407).json({ message: 'User not authenticated.' });
};

module.exports = { sign, verify, ensureLoggedIn, serviceSign }