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
const { pbkdfDigest, pbkdfIters, pbkdfLen, usernamePattern, currentPasswordScheme, minPasswordLength } = require('../../config');
const crypto = require('crypto');

// Reference: https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html
const pbkdf = (word, salt) => new Promise((resolve, reject) => 	// will return a Promise!
		crypto.pbkdf2(word, salt, pbkdfIters, pbkdfLen, pbkdfDigest,
		(err, key) => err !== null ? reject(err) : resolve(key.toString('base64'))));

// logs.get('_local/firstTime')	// check the presence of the flag
// .catch(e=>{						// if it does not exist
// 	console.log("Welcome to FOCUSA! Initialising database.");
// 	return security.putRole('_admin', "The administrator role.")	// create an admin role
// 	.then(o=> security.putRole('_super', "The superuser role."))
// 	.then(o=> security.createUser('admin','admin',['_admin']))	// then create a user admin
// 	.then(o=> logs.put({	// then create the flag
// 		_id:'_local/firstTime', value: true,
// 	}));
// }).catch(e=> console.error("Database initialization failed.", e));

const userExistsError = new Error('Username already exists. Please try another username.'),
      loginError = new Error('Login failed. Incorrect username or password.'),
      userNonExistant = new Error('User does not exist.');

// Built auth index to enforce one form of low-risk-low-conflict uniqueness.
// Reference: https://stackoverflow.com/a/1933616

/**
 * Create a User in the database, and add the username to the auth index.
 * @param {string} name User name, unique alphanumeric identifier.
 * @param {string} password used for validation.
 */
const createUser = async (name, password) => {
    assert(typeof name === 'string' && typeof password === 'string' 
    && password.length >= minPasswordLength, 
        "Invalid arguments for createUser.");
    assert(name == name.match(usernamePattern), 
        "User not created. name should match: " + usernamePattern);
    
    let salt = generateUUID(), uuid = generateUUID();
    let hash = await pbkdf(password, salt);    // hash the password
    let c = await focusa;    // wait until focusa resolves collections    
    
    // start by adding the user to the database,
    let newUser = await c.user.insert({
        uuid, name, hash, salt, 
        scheme: currentPasswordScheme
    });

    // also add a primary key index reference for user names
    return await c.auth.insert({ name, uuid })
    .catch(e => {   // if user already exists
        newUser.remove();   // remove the new User added to the database
        throw userExistsError;  // and throw
    });
};

/**
 * Delete an existing User from a database, along with the respective auth index entry.
 * @param {string} name User name, unique alphanumeric identifier.
 */
const deleteUser = async (name) => {
    assert(typeof name === 'string', 
        "Invalid arguments for deleteUser.");
    let c = await focusa;
    // execute a search on auth index to find username
    return await c.auth.findOne(name).exec()
    .then(doc => {  // then remove the doc after finding it
        if (doc) {
            let user = await doc.populate('uuid');
            doc.remove();   // remove the auth entry
            user.remove();  // also remove the ref user entry
            return doc;
        } else throw userNonExistant;
    });
};

/**
 * Validate a User, returns user details if password matches.
 * @param {string} name User name, unique alphanumeric identifier.
 * @param {string} password used for validation.
 */
const validateUser = async (name, password) => {
    assert(typeof name === 'string' && typeof password === 'string', 
        "Invalid arguments for validateUser.");
    let c = await focusa;
    // find the auth with matching name
    return await c.auth.findOne(name).exec()
    .then(async doc => {  // then collect the user details
        if (doc) {
            let user = await doc.populate('uuid');
            
            // TODO: ensure to check password scheme before checking password.
            let hash = await pbkdf(password, user.salt);
            // if the password hashes match
            if (hash == user.hash)
                return user;
            else throw loginError;
        } else throw userNonExistant;
    });
};

/**
 * Check if User exists in database, return user details.
 * @param {string} name User name, unique alphanumeric identifier.
 */
const userExists = async (name) => {
    assert(typeof name === 'string', 
    "Invalid arguments for userExists.");
    let c = await focusa;
    return await c.auth.findOne(name).exec()
    .then(async doc => {
        if (doc) {
            return await doc.populate('uuid');
        } else throw userNonExistant;
    })
};

// TODO(long term): maybe add functionality to update the user name?
/**
 * Update the User password.
 * @param {string} name User name, unique alphanumeric identifier.
 * @param {string} newpassword The new password, will update the previous password.
 */
const updateUser = async (name, newpassword) => {
    assert(typeof name === 'string' && typeof newpassword === 'string' 
    && newpassword.length >= minPasswordLength, 
        "Invalid arguments for updateUser.");
    let c = await focusa;
    // find the auth with matching name
    return await c.auth.findOne(name).exec()
    .then(async doc => {
        if(doc) {
            let user = await doc.populate('uuid');

            // TODO: ensure to check password scheme before checking password.
            // generate a new password hash
            let salt = generateUUID();
            let hash = await pbkdf(newpassword, salt);    // hash the password

            return await user.atomicPatch({
                salt, hash, scheme: currentPasswordScheme
            });
        } else throw userNonExistant;
    })
}

module.exports = {
    createUser, deleteUser, validateUser, updateUser, userExists
}