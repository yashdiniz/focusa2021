const { JWTsignOptions, JWTverifyOptions, JWTsecret, serviceSignOptions, serviceVerifyOptions } = require('../config');
const jwt = require('jsonwebtoken');
const { assert } = require('./databases');

/**
 * Signs a token using JWT.
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
    // token[0] === 'Bearer' NO NEED TO CHECK since JWT will fail if invalid anyway?
    try {
        return verify(token[token.length-1]);
    } catch(e) {
        console.log(e);
        return false;
    }
}

/**
 * Signs a token using JWT.
 * @param {object} payload The other session information stored in payload.
 */
 const serviceSign = (payload) => {
    return jwt.sign(payload, JWTsecret.private, {
        ...serviceSignOptions,
    });
};

/**
 * Verifies and returns the payload of the JWT token.
 * @param {string} token The JWT token to verify.
 */
const serviceVerify = (token) => {
    return jwt.verify(token, JWTsecret.public, {
        ...serviceVerifyOptions, 
        algorithms: serviceVerifyOptions.algorithms,
    });
};

module.exports = { sign, verify, ensureLoggedIn, serviceSign, serviceVerify }