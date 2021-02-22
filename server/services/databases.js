/**
 * This file contains database instances,
 * along with push-pull replication handlers.
 * author: @yashdiniz
 */
const path = require('path'), crypto = require('crypto');
const { UUIDSize, maxModRolesforCourse, defaultProfilePic } = require('../config');

const remote = 'http://admin:admin@localhost:5984/focusa';	// the remote database to sync with!

// const sync = () => {
//     syncHandlers.forEach(o => {
//         o.handler.on('complete', 
//             async ()=> console.log('Database', o.db, 'synced.')
//         ).on('error', e=>console.log(e));
//     });
// };

// assert(condition, message) simplifies the code structure, by immediately throwing if condition is not met.
const assert = (condition, message) => {
    if(!condition) throw message || 'Assertion failed!';
    else return true;
};

// generate a random number as UUID
// the UUID is made URL safe, while still maintaining base64, by basic substitution
const generateUUID = (size) => crypto.rng(size || UUIDSize)
                    .toString('base64')
                    .replace(/\//gi,'.').replace(/\+/gi,'-').replace(/\=/gi,'_')

// initiate the replication
// sync();

const RxDB = require('rxdb');
const leveldown = require('leveldown');
RxDB.addRxPlugin(require('pouchdb-adapter-leveldb'));

const db = await RxDB.createRxDatabase({
    name: 'focusa',
    adapter: leveldown,
    multiInstance:false,
    eventReduce: false,
});

const authSchema = {
    name: 'auth',
    title: 'FOCUSA auth schema',
    version: 0,
    description: "Contains the auth schema.",
    type: 'object',
    properties: {
        UUID: {
            type: 'string',
            primary: true,
        },
        name: {
            type: 'string',
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
        },
    },
    required: ['name', 'hash', 'salt', 'scheme'],
    indexes: ['name'],
};
const coursesSchema = {
    name: 'courses',
    title: 'FOCUSA course schema',
    version: 0,
    description: "Contains the courses schema.",
    type:'object',
    properties: {
        UUID: {
            type: 'string',
            primary: true,
        },
        name: {
            type: 'string',
            unique: true,
        },
        description: {
            type: 'string'
        },
        mods: {
            type: 'array',
            ref: 'roles',
            uniqueItems: true,
            maxItems: 2 || maxModRolesforCourse,
        },
    },
    required: ['name', 'description'],
    indexes: ['name'],
};
const rolesSchema = {
    name: 'roles',
    title: 'FOCUSA roles schema',
    version: 0,
    description: "Contains the roles schema.",
    type: 'object',
    properties: {
        UUID: {
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
    description: "Contains the posts schema.",
    type: 'object',
    properties: {
        UUID: {
            type: 'string',
            primary: true,
        },
        parent: {
            ref: 'posts',
            final: true,
            default: null,
        },
        text: {
            type: 'string',
        },
        course: {
            ref: 'courses',
            final: true,
            default: null
        },
        author: {
            ref: 'auth',
            final: true,
        },
        reported: {
            type: 'number',
            default: false, // false
        },
        approved: {
            type: 'number',
            default: true, // true
        },
        time: {
            type: 'string', // save datetime
        },
        attachmentURL: {
            type: 'string',
            final: true,
            default: null,
        },
    },
    required: ['text', 'time'],
    indexes: ['parent', 'course', 'author', 'reported', 'approved'], // TODO: find a way to incorporate tf-idf text indexing
};
const profileSchema = {
    name: 'profile',
    title: 'FOCUSA profile schema',
    version: 0,
    description: "Contains the profile schema.",
    type: 'object',
    properties: {
        authID: {
            ref: 'auth',
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
            ref: 'courses',
        },
    },
    required: ['fullName', 'about', 'display_pic']
};
const auth_rolesSchema = {
    name: 'auth_roles',
    title: 'FOCUSA auth_roles schema',
    version: 0,
    description: "Contains the auth_roles schema.",
    type: 'object',
    properties: {
        auth_roleID: {   // feed an auth_role as ID, enforced by programmer in code.
            type: 'string',
            primary: true,
        },
    },
    indexes: ['auth_roleID'],
    required: ['auth_roleID'],
};

const collections = await db.addCollections({
    auth: { schema: authSchema },
    courses: { schema: coursesSchema },
    roles: { schema: rolesSchema },
    posts: { schema: postsSchema },
    profile: { schema: profileSchema },
    auth_roles: { schema: auth_rolesSchema }
});

RxDB.addRxPlugin(require('pouchdb-adapter-http'));

const replicationState = collections.sync({
    remote,
    options: {
        live: true
    },
});

module.exports = {
    collections,
    assert, generateUUID
}