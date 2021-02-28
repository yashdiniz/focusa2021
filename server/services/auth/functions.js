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
const { pbkdfDigest, pbkdfIters, pbkdfLen, usernamePattern, currentPasswordScheme } = require('../../config');
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

const userExistsError = new Error("Username already exists. Please try another username.");

// Use this to enforce one form of low-risk-low-conflict uniqueness.
// Reference: https://stackoverflow.com/a/1933616
const createUser = async (name, password) => {
    assert(typeof name === 'string' && typeof password === 'string',
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