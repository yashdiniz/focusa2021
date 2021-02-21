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
const path = require("path") , fs = require("fs");

process.title = "FOCUSA auth service";

// Reference: https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html
pbkdf = (word, salt) => new Promise((resolve, reject) => 	// will return a Promise!
		crypto.pbkdf2(word, salt, config.pbkdfIters, config.pbkdfLen, config.pbkdfDigest,
		(err, key) => err !== null ? reject(err) : resolve(key.toString('base64'))));

// TODO: reference logs to a local DB, and synchronise!!
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

// assert(condition, message) simplifies the code structure, by immediately throwing if condition is not met.
let assert = (condition, message) => {
    if(!condition) throw message || "Assertion failed!";
    else return true;
};

