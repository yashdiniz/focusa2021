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
process.title = 'FOCUSA auth service';
const { logs, auth, assert, generateUUID } = require('../databases');
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

// Use this to enforce one form of low-risk-low-conflict uniqueness.
// Reference: https://stackoverflow.com/a/22440576/13227113
auth.createIndex({  // creating an index for enforcing uniqueness in usernames
	index: { 
		fields: ['name'],
		ddoc: 'indexes',
		name: 'auth_unique'
	}
}).then(() => auth.find({
	selector: { 
		name: null 
	}, 
	use_index:'indexes', 
	limit: 0 
})).catch(e => console.error(e));

const createUser = (name, password) => {
    assert(typeof name === 'string' && typeof password === 'string',
        "Invalid arguments for createUser.");
    assert(name == name.match(usernamePattern), "User not created. name should match: " + usernamePattern);
    let salt = generateUUID();
    return pbkdf(password, salt)    // hash the password
    .then(hash => {
        auth.post({ // db.post() ensures random UUIDs, useful in this scenario
            name, hash, salt, scheme: currentPasswordScheme
        }).then(
            // 1. temp hold the ID of document just posted.
            // 2. try to find(using auth_unique index) for another document with matching name.
            // 3. if a match is found, then delete the document just posted, and throw failure.
        )
        return auth.find({
            selector: { name }, // search for any users already with this name...
            use_index:'indexes',
        });
    })
}