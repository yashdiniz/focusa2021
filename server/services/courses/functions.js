/**
 * This file contains a few important functions
 * created to ease coding the microservice.
 * 
 * Some of these functions may not actually be 
 * incorporated into the final microservice,
 * added for house-keeping tasks.
 * 
 * author: @imamsab
 */
const { focusa, assert, generateUUID } = require('../databases');
const { create } = require('axios');
const { maxModRolesforCourse, authRealm, serviceAuthPass, JWTsignOptions } = require('../../config');

let token = '';
const auth = create({
    baseURL: `${authRealm}`,
    timeout: 5000,
    headers: { 'authorization': token },
});
// TODO: add the base64 encode function
// TODO: also take care of the refresh session scenario!
let loginDetails = base64Encode(`courses:${serviceAuthPass}`);
setInterval(() => auth.get('/', {
    headers: `Basic ${loginDetails}`
}).then(res => token = res.data.token), (JWTsignOptions.expiresIn-10)*1000);

/**
 * Adds a course to the database.
 * @param {string} name Name used to refer the course (not a key).
 * @param {string} description Description of the course (not a key).
 */
const addCourse = async (name, description) => {
    assert(typeof name === 'string' && typeof description === 'string');

    let uuid = generateUUID();
    let f = await focusa;

    let admin = await auth.get('/getRoleByName', {
        params: { name: 'admin' },
        // headers: { Authorization:  }
    }).then(res => res.data.uuid);

    return await f.courses.insert({
        uuid,name, description,
        mods: [ admin ] // allowing only admin users to moderate
    });
};

module.exports = {
    addCourse, 
};