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
const { name } = require('dayjs/locale/*');
const e = require('express');

const CourseExistsError = new Error('Course alredy exists'),
      CourseNonExsistent = new Error('Course Does not exists');

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
    assert(typeof name === 'string' && typeof description === 'string', 'Invalid arguments for addCourse.');

    let uuid = generateUUID();
    let f = await focusa;

    let admin = await auth.get('/getRoleByName', {
        params: { name: 'admin' },
        // headers: { Authorization:  }
    }).then(res => res.data.uuid);

    return await f.courses.insert({
        uuid,name, description,
        mods: [ admin ] // allowing only admin users to moderate
    }).catch(e => { throw CourseExistsError });
};

/**
 * get a course with the matching id
 * @param {string} id database key to identify the course
 * @returns the  course object with matching id
 */
const getCourseById = async (id) => {
    assert(typeof id === 'string', 'Invalid arguments for getCourseById.');
    let c = await focusa;

    return await c.courses.findOne(id).exec()
    .then(async doc=>{
        if (doc) return doc;

        else throw CourseNonExsistent;
    });

}

/**
 * get course with the matching name
 * @param {string} name name of the course to find
 * @returns the course object with the matching name
 */
const getCourseByName = async(name) => {
    assert(typeof name === 'string', 'Invalid arguments for getCourseByName');
    let c = await focusa;

    return await c.courses.find({selector:{name}}).exec()
    .then(async doc=>{
        if (doc) return doc;

        else throw CourseNonExsistent;
    });
}

/**
 * update course with matching id
 * @param {string} id id of the course to update
 * @param {string} name name to update the course to
 * @param {string} description description to update the course to
 * @returns the updated name and description of the course
 */
const updateCourse = async(id,name,description) => {

    assert(typeof id ==='string' && typeof name === 'string' && typeof description === 'string', 'Invalid arguments for updateCourse');
    let c = await focusa;

    return await c.courses.findOne(id).exec()
    .then(async doc =>{

        if(doc) return await doc.atomicPatch({
            name, description
        });

        else throw CourseNonExsistent;
    });

}

const deleteCourse = async (id) =>{
    assert(typeof id === 'string');
    let c = await focusa;

    return await c.courses.findOne(id).exec()
    .then(async doc=>{
        
        if(doc){
            doc.remove();
            return doc;
        }

        else throw CourseNonExsistent;
    });
}

module.exports = {
    addCourse, getCourseById,getCourseByName,updateCourse,
};