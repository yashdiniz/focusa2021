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
const { pbkdfDigest, pbkdfIters, pbkdfLen, usernamePattern, currentPasswordScheme, minPasswordLength, maxNameLength, rolePattern } = require('../../config');
const crypto = require('crypto');

// Reference: https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html
/**
 * The hashing technique used for passwords.
 * @param {string} word The word to hash.
 * @param {string} salt A random salt to use for hash obfuscation.
 * @returns {Promise} A hashed key.
 */
const pbkdf = (word, salt) => new Promise((resolve, reject) => 	// will return a Promise!
		crypto.pbkdf2(word, salt, pbkdfIters, pbkdfLen, pbkdfDigest,
		(err, key) => err !== null ? reject(err) : resolve(key.toString('base64'))));

const userExistsError = new Error('Username already exists.'),
      loginError = new Error('Login failed. Incorrect username or password.'),
      userNonExistant = new Error('User does not exist.'),
      roleExistsError = new Error('Role already exists.'),
      roleNonExistant = new Error('Role does not exist.');

// Built auth index to enforce one form of low-risk-low-conflict uniqueness.
// Reference: https://stackoverflow.com/a/1933616

/**
 * Create a User in the database, and add the username to the auth index.
 * @param {string} name User name.
 * @param {string} password used for validation.
 * @returns {Promise} The user object just created, without the sensitive information.
 */
const createUser = async (name, password) => {
    assert(typeof name === 'string' && typeof password === 'string' 
    && password.length >= minPasswordLength && name.length <= maxNameLength, 
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
 * @param {string} name User name.
 * @returns {Promise} The User object just deleted, without the sensitive information.
 */
const deleteUser = async (name) => {
    assert(typeof name === 'string', 
        "Invalid arguments for deleteUser.");
    let c = await focusa;
    // execute a search on auth index to find username
    return await c.auth.findOne(name).exec()
    .then(async doc => {  // then remove the doc after finding it
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
 * @param {string} name User name.
 * @param {string} password used for validation.
 * @returns {Promise} A User object.
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
            if (hash == user.hash) return user;
            else throw loginError;
        } else throw userNonExistant;
    });
};

/**
 * Check if User exists in database, return user details.
 * @param {string} name User name.
 * @returns {Promise} A User object.
 */
const userExists = async (name) => {
    assert(typeof name === 'string', 
    "Invalid arguments for userExists.");
    let c = await focusa;
    return await c.auth.findOne(name).exec()
    .then(async doc => {
        if (doc) return await doc.populate('uuid');
        else throw userNonExistant;
    });
};

/**
 * Gets a user by their ID.
 * @param {string} id Database UUID key used to identify user.
 * @returns {Promise} A User object.
 */
const getUserById = async (id) => {
    assert(typeof id === 'string', 
    "Invalid arguments for getUserById.");
    let c = await focusa;
    return await c.user.findOne(id).exec()
    .then(async doc => {
        if (doc) return doc;
        else throw userNonExistant;
    });
}

// TODO(long term): maybe add functionality to update the user name?
/**
 * Update the User password.
 * @param {string} name User name.
 * @param {string} newpassword The new password, will update the previous password.
 * @returns {Promise} The User object just updated.
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
};

/**
 * Creates a role in the database.
 * @param {string} name Name of the role to create.
 * @returns {Promise} The Role object just created.
 */
const createRole = async (name) => {
    assert(typeof name === 'string' && name.length <= maxNameLength, 
        "Invalid arguments for createRole.");
    assert(name == name.match(rolePattern), 
        "Role not added. name should match: " + rolePattern);

    let c = await focusa;
    let uuid = generateUUID();  // generate the UUID

    // insert the role document into roles
    let newRole = await c.roles.insert({ name, uuid });

    // also insert the role into the index
    return await c.role.insert({ name, uuid })
    .catch(e => {
        newRole.remove();   // remove if user exists
        throw roleExistsError;
    });
};

/**
 * Deletes a role from the database.
 * @param {string} name Name of the role to delete.
 * @returns {Promise} The Role object just deleted.
 */
const deleteRole = async (name) => {
    assert(typeof name === 'string', 
        "Invalid arguments for deleteRole.");
    let c = await focusa;
    // execute a search on role index to find username
    return await c.role.findOne(name).exec()
    .then(async doc => {  // then remove the doc after finding it
        if (doc) {
            let role = await doc.populate('uuid');
            doc.remove();   // remove the role entry
            role.remove();  // also remove the ref roles entry
            return doc;
        } else throw roleNonExistant;
    });
};

/**
 * Checks if a role is already created in the database.
 * @param {string} name Name of the role to check.
 * @returns {Promise} A Role object.
 */
const roleExists = async (name) => {
    assert(typeof name == 'string',
        "Invalid arguments for roleExists.");
    let c = await focusa;
    return await c.role.findOne(name).exec()
    .then(async doc => {
        if(doc) return await doc.populate('uuid');
        else throw roleNonExistant;
    });
};

/**
 * Gives a role to a user.
 * @param {string} role The role to give.
 * @param {string} user The user to give the role to.
 * @returns {Promise} A user_roles pair.
 */
const giveRole = async (role, user) => {
    assert(typeof role === 'string' && typeof user === 'string', 
        "Invalid arguments for giveRole.");
    let c = await focusa;
    // first find the user and the role.
    let u = await userExists(user);
    let r = await roleExists(role);

    return await c.user_roles.insert({ 
        user_roleID: `${u.uuid}_${r.uuid}`, 
        user: u.uuid, 
        role: r.uuid, 
    });
};

/**
 * Get a role by their ID.
 * @param {string} id Database UUID used to identify role.
 * @returns {Promise} A Role object.
 */
const getRoleById = async (id) => {
    assert(typeof id === 'string', 
    "Invalid arguments for getRoleById.");
    let c = await focusa;
    return await c.roles.findOne(id).exec()
    .then(doc => {
        if (doc) return doc;
        else throw roleNonExistant;
    });
};

/**
 * Gets a list of Roles assigned to the User.
 * @param {string} user The User name to find the roles of.
 * @returns {Array<Promise>} An array of Roles.
 */
const getRolesOfUser = async (user) => {
    assert(typeof user === 'string', 
    "Invalid arguments for getRolesOfUser.");
    let c = await focusa;
    // first find the username
    return await userExists(user)
    .then(doc => c.user_roles.find({ selector: 
        { user: doc.uuid }
    }).exec())
    .then(docs => Promise.all(docs.map(async doc => await doc.populate('role'))));
};

/**
 * Gets a list of Roles assigned to a User.
 * @param {string} role The Role name to find the users for.
 * @returns {Array<Promise>} An array of Users.
 */
const getUsersOfRole = async (role) => {
    assert(typeof role === 'string', 
    "Invalid arguments for getUsersOfRole.");
    let c = await focusa;
    return await roleExists(role)
    .then(doc => c.user_roles.find({ selector: 
        { role: doc.uuid }
    }).exec())
    .then(docs => Promise.all(docs.map(async doc => await doc.populate('user'))));
};

/**
 * Finds if a user_role pair exists in the database.
 * @param {string} user The User name to check.
 * @param {string} role The Role name to check.
 * @returns {Promise} A user_role pair.
 */
const userHasRole = async (user, role) => {
    assert(typeof user === 'string' && typeof role === 'string', 
    "Invalid arguments for userHasRole.");
    let c = await focusa;
    let u = await userExists(user);
    let r = await roleExists(role);
    return await c.user_roles.findOne(`${u.uuid}_${r.uuid}`).exec();
};

// create admin if does not already exist
// TODO: make this process more secure!!
createUser('admin', 'gyroscope')
.catch(e => console.error('Attempted creating admin. ' + e.message));
// also give admin user admin role
createRole('admin')
.catch(e => console.error('Attempted creating admin. ' + e.message))
.finally(o => giveRole('admin', 'admin'))
.catch(e => console.error('Attempted giving role to admin. ' + e.message));

module.exports = {
    createUser, deleteUser, validateUser, updateUser, userExists, getUserById,
    createRole, deleteRole, roleExists, giveRole, getRoleById, getRolesOfUser, getUsersOfRole, userHasRole,
    userExistsError, loginError, userNonExistant,
    roleExistsError, roleNonExistant,
};