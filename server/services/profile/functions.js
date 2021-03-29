/**
 * List of functions required for interacting with 
 * profile collection in CRUD fashion.
 * author: @reydias06
 */

const { focusa, assert } = require('../databases');
const { defaultfullName, defaultAbout, authRealm, serviceAuthPass, JWTsignOptions } = require('../../config');

const { create } = require('axios');
let token = '';
const auth = create({
    baseURL: `${authRealm}`,
    timeout: 5000,
});
let loginDetails = Buffer.from(`profile:${serviceAuthPass}`).toString('base64');
auth.get('/', {
    headers: {authorization: `Basic ${loginDetails}`}
}).then(res => token = res.data.token);
setInterval(() => auth.get('/', {
    headers: {authorization:`Basic ${loginDetails}`}
}).then(res => token = res.data.token), (JWTsignOptions.expiresIn-10)*1000);

const profileNonExistant = new Error('Profile does not exist.');

/**
 * Creates a profile for a User with matching UUID.
 * @param {string} id The ID of the user which references profile.
 */
const createProfile = async (id)=> {
    assert(typeof id === 'string',
    'Invalid arguments for createProfile.');

    let c = await focusa;
    // Rule of JAMstack: isolation. 
    // We cannot access user collection inside profile activity.
    // hence invoking the auth service through axios.
    try {
        return await auth.get('/getUserById', {
            params: { id },
            headers: { authorization : token }
        }).then(res => c.profile.insert({
            userID: res.data.uuid,
            fullName: defaultfullName, 
            about: defaultAbout,
            interests: [
                // { course: }
            ],
        }));
    } catch (e) {
        console.error('createProfile:', e.message);
        // throw profileNonExistant;
    }
};

/**
 * Gets a profile with matching userID.
 * Also creates a profile if it does not exist.
 * @param {string} userID The ID of the user which references profile.
 * @returns 
 */
const getProfile = async (userID)=> {
    assert(typeof userID === 'string',
    'Invalid arguments for getProfile.');

    let c = await focusa;
    // return the profile if it exists
    return await c.profile.findOne(userID).exec()
    .then(doc => {
        if(doc) return doc;
        // otherwise, create the profile if non-existant.
        else createProfile(userID);
    });
}

const updateProfile = async (userID, fullName, about, display_pic)=> {
    assert(typeof userID === 'string' &&
    typeof fullName === 'string' &&
    typeof about === 'string' &&
    (!display_pic ||  typeof display_pic === 'string'),
    'Invalid arguments for createProfile.');

    let c = await focusa;
    // find a profile with matching userID
    let profile = await c.profile.findOne(userID).exec();
    if(profile) {
        // update if profile exists
        return await profile.atomicPatch({
            fullName,
            about,
            display_pic,
        });
    } else throw profileNonExistant;
};

const deleteProfile = async (userID) => {
    assert(typeof userID === 'string', 'Invalid arguments for deleteProfile.');

    let c = await focusa;

    let profile = await c.profile.findOne(userID).exec();
    if(profile) {
        profile.remove();
        return profile;
    } else throw profileNonExistant;
}

const addInterest = async () => {  
    // TODO
};

const removeInterest = async () => {
    // TODO
}

module.exports = {
    getProfile, updateProfile, deleteProfile,
}