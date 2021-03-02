/**
 * List of functions required for interacting with 
 * profile collection in CRUD fashion.
 * author: @reydias06
 */

const { focusa, assert } = require('../databases');
const { defaultfullName, defaultAbout } = require('../../config');

const userNonExistant = new Error('User does not exist.');

const createProfile = async (userID)=> {
    assert(typeof userID === 'string',
    'Invalid arguments for createProfile.');

    let c = await focusa;
    return await c.user.findOne(userID).exec()
    .then(doc => {
        if (doc) {
            return c.profile.insert({
                userID,
                fullName: defaultfullName, 
                about: defaultAbout,
                interests: [],
            });
        } else throw userNonExistant;
    });
};

const getProfile = async (userID)=> {
    assert(typeof userID === 'string',
    'Invalid arguments for getProfile.');

    let c = await focusa;
    return await c.user.findOne(userID).exec()
    .then(doc => {
        if (doc) {
            return c.profile.findOne(userID).exec();
        } else throw userNonExistant;
    })
}

const updateProfile = async (userID, fullName, about, display_pic)=> {
    assert(typeof userID === 'string' &&
    typeof fullName === 'string' &&
    typeof about === 'string' &&
    (!display_pic ||  typeof display_pic === 'string'),
    'Invalid arguments for createProfile.');

    let c = await focusa;
    return await c.user.findOne(userID).exec()
    .then(async doc => {
        if (doc) {
            let profile = await c.profile.findOne(userID).exec();
            profile.atomicPatch({
                fullName,
                about,
                display_pic,
            });
        } else throw userNonExistant;
    });
};

const addInterest = async () => {
    // TODO
};

const removeInterest = async () => {
    // TODO
}

module.exports = {
    createProfile, getProfile, updateProfile
}