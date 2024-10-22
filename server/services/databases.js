/**
 * This file contains database instances,
 * along with push-pull replication handlers.
 * author: @yashdiniz
 */
const path = require('path'), crypto = require('crypto');
const { UUIDSize, maxModRolesforCourse, 
    defaultProfilePic, remote, projectRoot } = require('../config');

const RxDB = require('rxdb');
const leveldown = require('leveldown');
RxDB.addRxPlugin(require('pouchdb-adapter-leveldb'));
RxDB.addRxPlugin(require('pouchdb-quick-search'))

/**
 * Asserts a condition, and throws a message on violation.
 * @param {boolean} condition Condition to be asserted.
 * @param {string} message Message to throw on condition violation.
 */
const assert = (condition, message) => {
    if(!condition) throw message || 'Assertion failed!';
    else return true;
};

// generate a random number as UUID
// the UUID is made URL safe, while still maintaining base64, by basic substitution
/**
 * Generates a random string of characters.
 * @param {number} size Number of random characters to return.
 */
const generateUUID = (size) => crypto.rng(size || UUIDSize)
                    .toString('base64')
                    .replace(/\//gi,'.').replace(/\+/gi,'-').replace(/\=/gi,'_')

// initiate the replication
// sync();

const authSchema = {
    name: 'auth',
    title: 'FOCUSA auth schema',
    version: 0,
    description: "Collection intentionally created to ensure unique usernames.",
    type: 'object',
    properties: {
        name: {
            type: 'string',
            primary: true,
        },
        uuid: {
            type: 'string',
            ref: 'user',
            unique: true,
            final: true,
        }
    },
    required: ['uuid'],
}

const userSchema = {
    name: 'user',
    title: 'FOCUSA user schema',
    version: 0,
    description: "Contains the user details needed for authentication.",
    type: 'object',
    properties: {
        uuid: {
            type: 'string',
            primary: true,
        },
        name: {
            type: 'string',
            ref: 'auth',
            unique: true,
        },
        hash: {
            type: 'string',
        },
        salt: {
            type: 'string',
        },
        scheme: {
            type: 'string',
            enum: ['pbkdf2'],
        },
    },
    required: ['name', 'hash', 'salt', 'scheme'],
    indexes: ['name'],
};

const coursesSchema = {
    name: 'courses',
    title: 'FOCUSA course schema',
    version: 0,
    description: "Contains the course descriptions and moderator roles.",
    type:'object',
    properties: {
        uuid: {
            type: 'string',
            primary: true,
        },
        name: {
            type: 'string',
        },
        description: {
            type: 'string'
        },
        mods: {
            type: 'array',
            uniqueItems: true,  // if empty, default to admin
            maxItems: 2 || maxModRolesforCourse,
            items: {
                type: 'string',
                ref: 'roles',
            }
        },
    },
    required: ['name', 'description'],
    indexes: ['name'],
};

const roleSchema = {
    name: 'role',
    title: 'FOCUSA role schema',
    version: 0,
    description: "Collection intentionally created to ensure unique roles.",
    type: 'object',
    properties: {
        name: {
            type: 'string',
            primary: true,
        },
        uuid: {
            type: 'string',
            ref: 'roles',
            unique: true,
        },
    },
    required: ['name', 'uuid'],
    indexes: ['name', 'uuid']
};
const rolesSchema = {
    name: 'roles',
    title: 'FOCUSA roles schema',
    version: 0,
    description: "Contains a collection of roles which any user can have.",
    type: 'object',
    properties: {
        uuid: {
            type: 'string',
            primary: true,
        },
        name: {
            type: 'string',
            unique: true,
        },
    },
    required: ['name'],
    indexes: ['name']
};
const postsSchema = {
    name: 'posts',
    title: 'FOCUSA posts schema',
    version: 0,
    description: "Contains the posts published by authors, belonging to a course, and flagged using other attributes.",
    type: 'object',
    properties: {
        uuid: {
            type: 'string',
            primary: true,
        },
        parent: {
            type: 'string',
            ref: 'posts',
            final: true,
            default: '',
        },
        text: {
            type: 'string',
        },
        course: {
            type: 'string',            
            ref: 'courses',
            final: true,
            default: '',
        },
        author: {
            ref: 'user',
            type: 'string',
            final: true,
        },
        reported: {
            type: 'number',
            default: 0,
        },
        approved: {
            type: 'number',
            default: 1,
        },
        time: {
            type: 'number', // save timestamp
        },
        attachmentURL: {
            type: 'string',
            final: true,
            default: '',
        },
    },
    required: ['text', 'time'],
    indexes: ['parent', 'course', 'author', 'reported', 'approved', 'time'],
};
const profileSchema = {
    name: 'profile',
    title: 'FOCUSA profile schema',
    version: 0,
    description: "Contains all the user details needed for UI and other purposes.",
    type: 'object',
    properties: {
        userID: {
            ref: 'user',    // one-to-one
            type: 'string',
            primary: true,
        },
        fullName: {
            type: 'string',
        },
        about: {
            type: 'string',
        },
        display_pic: {
            type: 'string',
            default: defaultProfilePic,
        },
        interests: {
            uniqueItems: true,
            type: 'array',
            items: {
                type: 'string',
                ref: 'courses',
            }
        },
    },
    required: ['fullName', 'about', 'display_pic'],
    indexes: ['interests.[]'],   // find out who is subscribed
};
const user_rolesSchema = {
    name: 'user_roles',
    title: 'FOCUSA user_roles schema',
    version: 0,
    description: "Contains the user_roles schema.",
    type: 'object',
    properties: {
        user_roleID: {   // feed an user_role as ID, enforced by programmer in code.
            type: 'string',
            primary: true,
        },
        user: {
            type: 'string',
            ref: 'user',
            final: true,
        },
        role: {
            type: 'string',
            ref: 'roles',
            final: true,
        }
    },
    indexes: ['user_roleID', 'user', 'role'],
    required: ['user_roleID', 'user', 'role'],
};

const notificationSchema = {
    name: 'notifications',
    title: 'FOCUSA notifications schema',
    version: 0,
    description: "Contains the notifications for the posts",
    type: 'object',
    properties: {
        uuid: {
            type: 'string',
            primary: true
        },
        time: {
            type: 'number',
            final: true
        },
        channel: {
            type: 'string',
            enum: ['new_post']
        },
        course: {
            type: 'string',
            ref: 'courses'
        },
        body: {
            type: 'string'
        },
        link: {
            type: 'string'
        }
    },
    indexes: ['time','channel','course'],
    required: ['time', 'channel', 'body', 'link']
};

const db = RxDB.createRxDatabase({
    name: path.join(projectRoot, 'db/focusa'),
    adapter: leveldown,
    multiInstance: true,
    eventReduce: false,
}).catch(console.error);

const focusa = db.then(database=> database.addCollections({
    auth: { schema: authSchema },
    user: { schema: userSchema },
    courses: { schema: coursesSchema },
    role: { schema: roleSchema },
    roles: { schema: rolesSchema },
    posts: { schema: postsSchema },
    profile: { schema: profileSchema },
    user_roles: { schema: user_rolesSchema },
    notifications: { schema: notificationSchema }
})).catch(console.error);

RxDB.addRxPlugin(require('pouchdb-adapter-http'));

/**
 * Returns a Promise holding the state of replication process.
 */
const replicationState = async () =>
await focusa.then(coll => {
    let collections = Object.keys(coll);
    let syncs = [];
    for (var c in collections)
        syncs.push(coll[collections[c]].sync({
            remote: remote + collections[c],
            options: {
                live: true
            },
        }));
    return syncs;
}).catch(console.error);

module.exports = {
    db, focusa, replicationState,
    assert, generateUUID
}