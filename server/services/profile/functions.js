/**
 * List of functions required for interacting with 
 * profile collection in CRUD fashion.
 * author: @reydias06
 */

const { focusa, assert } = require('../databases');
const { defaultfullName, defaultAbout } = require('../../config');

const profileNonExistant = new Error('Profile does not exist.');

/**
 * 
 * @param {string} userID The ID of the user which references profile.
 */
const createProfile = async (userID)=> {
    assert(typeof userID === 'string',
    'Invalid arguments for createProfile.');

    let c = await focusa;
    // Rule of JAMstack: isolation. 
    // We cannot access user collection inside profile activity.
    // Trusting that profiles will not be spammed.
    return await c.profile.insert({
        userID,
        fullName: defaultfullName, 
        about: defaultAbout,
        interests: [],
    });
};

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

const addInterest = async () => {
    // TODO
};

const removeInterest = async () => {
    // TODO
}

module.exports = {
    getProfile, updateProfile
}