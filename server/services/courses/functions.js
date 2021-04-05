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
const { authRealm, serviceAuthPass, JWTsignOptions } = require('../../config');

const courseExistsError = new Error('Course already exists.'),
      courseNonExistant = new Error('Course does not exist.');


const { create } = require('axios');
let token = '';
const auth = create({
    baseURL: `${authRealm}`,
    timeout: 5000,
});

let loginDetails = Buffer.from(`courses:${serviceAuthPass}`).toString('base64');
auth.get('/', {
    headers: {authorization:`Basic ${loginDetails}`}
}).then(res => token = res.data.token).catch(console.error);
setInterval(() => auth.get('/', {
    headers: {authorization:`Basic ${loginDetails}`}
}).then(res => token = res.data.token).catch(console.error), (JWTsignOptions.expiresIn-10)*1000);

/**
 * Adds a course to the database.
 * @param {string} name Name used to refer the course (not a key).
 * @param {string} description Description of the course (not a key).
 */
const addCourse = async (name, description) => {
    assert(typeof name === 'string' && typeof description === 'string', 'Invalid arguments for addCourse.');

    let uuid = generateUUID();
    let f = await focusa;

    let admin = await auth.get('/getRoleByName', {
        params: { name: 'admin' },
        headers: { authorization: token }
    }).then(res => res.data.uuid);

    // TODO: Create a role with name matching Course being added.
    // TODO: Allow the role created to become moderator.
    return await f.courses.insert({
        uuid,name, description,
        mods: [ admin ] // allowing only admin users to moderate
    }).catch(e => { throw courseExistsError });
};

/**
 * Get a course with matching ID.
 * @param {string} id Database key to identify the course.
 * @returns Course object with matching ID.
 */
const getCourseById = async (id) => {
    assert(typeof id === 'string', 'Invalid arguments for getCourseById.');
    let c = await focusa;
    return await c.courses.findOne(id).exec()
    .then(async doc=>{
        if (doc) return doc;
        else throw courseNonExistant;
    });
}

/**
 * Get a course with matching name.
 * @param {string} name The name of the course to find.
 * @returns Array of Course objects with the matching name.
 */
const getCoursesByName = async(name) => {
    assert(typeof name === 'string', 'Invalid arguments for getCourseByName');
    let c = await focusa;
    return await c.courses.find({selector:{name}}).exec()
    .then(async docs=>{
        if (docs) return docs;
        else throw courseNonExistant;
    });
}

/**
 * Update a course with matching ID.
 * @param {string} id The database key of the course to update.
 * @param {string} name Update the course name.
 * @param {string} description Update the course description.
 * @returns Course object after updating.
 */
const updateCourse = async(id,name,description) => {
    assert(typeof id ==='string' && typeof name === 'string' && typeof description === 'string', 'Invalid arguments for updateCourse');
    let c = await focusa;
    return await c.courses.findOne(id).exec()
    .then(async doc =>{
        if(doc) return await doc.atomicPatch({
            name, description
        });
        else throw courseNonExistant;
    });
}

/**
 * Deletes a course with the matching ID.
 * @param {string} id The database key of the course to delete.
 * @returns Course object of the deleted course.
 */
const deleteCourse = async (id) =>{
    assert(typeof id === 'string', "Invalid arguments for deleteCourse.");
    let c = await focusa;
    return await c.courses.findOne(id).exec()
    .then(async doc=>{
        if(doc){
            doc.remove();
            return doc;
        } else throw courseNonExistant;
    });
}

module.exports = {
    addCourse, getCourseById, getCoursesByName, updateCourse, deleteCourse,
};