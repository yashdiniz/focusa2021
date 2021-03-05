const { JWTsignOptions, JWTverifyOptions, JWTsecret } = require('../config');
const jwt = require('jsonwebtoken');

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
    });
};

module.exports = { sign, verify }