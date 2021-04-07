/**
 * List of functions required for interacting with 
 * profile collection in CRUD fashion.
 * author: @reydias06
 */

const { focusa, assert } = require('../databases');
const { defaultfullName, defaultAbout, authRealm, serviceAuthPass, JWTsignOptions, defaultProfilePic } = require('../../config');

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

const profileNonExistant = new Error('Profile does not exist.'),
      profileNotInterested = new Error('Profile is not interested in the course.');

/**
 * Creates a profile for a User with matching UUID.
 * @param {string} id The ID of the user which references profile.
 * @returns Profile object with matching ID.
 */
const createProfile = async (id)=> {
    assert(typeof id === 'string',
    'Invalid arguments for createProfile.');

    let c = await focusa;
    // Rule of JAMstack: isolation. 
    // We cannot access user collection inside profile activity.
    // hence invoking the auth service through axios.
    return await auth.get('/getUserById', {
        params: { id },
        headers: { authorization : token }
    }).then(res => c.profile.insert({
        userID: res.data.uuid,
        fullName: defaultfullName, 
        about: defaultAbout,
        display_pic: defaultProfilePic, 
        interests: [],
    }));
};

/**
 * Gets a profile with matching userID.
 * Also creates a profile if it does not exist.
 * @param {string} userID The ID of the user which references profile.
 * @returns Profile object with matching ID.
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
        else return createProfile(userID);
    });
}

/**
 * Updates a profile with matching userID.
 * @param {string} userID The ID of the user which references profile.
 * @param {string} fullName The fullName to update to.
 * @param {string} about The about to update to.
 * @param {string} display_pic The display_pic URL to update to.
 * @returns Promise containing Profile object.
 */
const updateProfile = async (userID, fullName, about, display_pic)=> {
    assert(typeof userID === 'string' &&
    typeof fullName === 'string' &&
    typeof about === 'string' &&
    (!display_pic ||  typeof display_pic === 'string'),
    'Invalid arguments for createProfile.');

    // find a profile with matching userID
    let profile = await getProfile(userID);
    if(profile) {
        // update if profile exists
        return await profile.atomicPatch({
            fullName,
            about,
            display_pic,
        });
    } else throw profileNonExistant;
};

/**
 * Deletes the Profile with a matching userID
 * @param {string} userID The id of the profile to be deleted.
 * @returns Promise deleted Profile object.
 */
const deleteProfile = async (userID) => {
    assert(typeof userID === 'string', 'Invalid arguments for deleteProfile.');

    let c = await focusa;

    return await c.profile.findOne(userID).exec()
    .then(profile => {
        if(profile) {
            profile.remove();
            return profile;
        } else throw profileNonExistant;
    });
}

const addInterest = async (userID, courseID) => {  
    assert(typeof userID === 'string'
    && typeof courseID === 'string', 
    'Invalid arguments for addInterest.');
    return await getProfile(userID)
    .then(async doc => {
        if(doc) {
            doc.update({
                $addToSet: {
                    interests: courseID
                }
            });
            return await getProfile(userID);
        } else throw profileNonExistant;
    });
};

const removeInterest = async (userID, courseID) => {
    assert(typeof userID === 'string'
    && typeof courseID === 'string', 
    'Invalid arguments for removeInterest.');
    return await getProfile(userID)
    .then(doc => {
        if(doc) {
            let filtered = doc.interests.filter( v=> v !== courseID);
            return doc.atomicPatch({
                interests: filtered
            });
        } else throw profileNonExistant;
    });
}

const profileHasInterest = async (userID, courseID) => {
    assert(typeof userID === 'string'
    && typeof courseID === 'string', 
    'Invalid arguments for profileHasInterest.');
    let c = await focusa;
    return await c.profile.find({
        selector: {
            userID,
            interests: {
                $in: [courseID]
            }
        }
    }).exec()
    .then(doc => {
        if(doc[0]) return doc[0]; // return only the first instance that matches
        else throw profileNotInterested;
    })
}

const getInterestsOfProfile = async (userID) => {
    assert(typeof userID === 'string', 'Invalid arguments for getInterestsOfProfile.');

    return await getProfile(userID)
    .then(doc => {
        if(doc) return doc.interests;
        else throw profileNonExistant;
    });
}

const getProfilesWithInterest = async (courseID) => {
    assert(typeof courseID === 'string', 
    'Invalid arguments for getProfilesWithInterest.');
    let c = await focusa;
    return await c.profile.find({
        selector: {
            interests: {
                $in: [courseID]
            }
        }
    }).exec()
    .then(docs => {
        return docs; // return only the first instance that matches
    })
}

module.exports = {
    getProfile, updateProfile, deleteProfile,addInterest, removeInterest, profileHasInterest,
    getInterestsOfProfile, getProfilesWithInterest
}