/**
 * This file contains a few important functions
 * created to ease coding the microservice.
 * 
 * Some of these functions may not actually be 
 * incorporated into the final microservice,
 * added for house-keeping tasks.
 * 
 * author: @yashdiniz
 */
const { focusa, assert, generateUUID } = require('../databases');
const { maxModRolesforCourse } = require('../../config');

/**
 * Adds a course to the database.
 * @param {string} name Name used to refer the course (not a key).
 * @param {string} description Description of the course (not a key).
 */
const addCourse = async (name, description) => {
    assert(typeof name === 'string' && typeof description === 'string',
    "Invalid arguments for addCourse.");
    
};

module.exports = {
    addCourse, 
};