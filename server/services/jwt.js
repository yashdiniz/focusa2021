const { JWTsignOptions, JWTverifyOptions, JWTsecret } = require('../config');
const jwt = require('jsonwebtoken');
const { assert } = require('./databases');

/**
 * Signs a token using JWT.
 * @param {string} username Username as subject of payload.
 * @param {object} payload The other session information stored in payload.
 */
const sign = (payload) => {
    return jwt.sign(payload, JWTsecret.private, {
        ...JWTsignOptions,
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
const ensureLoggedIn = (token) => {
    assert(typeof token === 'string',
    "Invalid arguments for ensureLoggedIn.");
    token = token.split(' ');
    try {
        return verify(token[token.length-1]);
    } catch(e) {
        console.log(e);
        return false;
    }
}

module.exports = { sign, verify, ensureLoggedIn }