/**
 * This file contains database instances,
 * along with push-pull replication handlers.
 * author: @yashdiniz
 */
const path = require('path'), crypto = require('crypto');
const { UUIDSize, maxModRolesforCourse, defaultProfilePic, remote } = require('../config');

const RxDB = require('rxdb');
const leveldown = require('leveldown');
RxDB.addRxPlugin(require('pouchdb-adapter-leveldb'));

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
            uniqueItems: true,
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
            type: 'string',
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
            default: '',
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
            type: 'string',
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
            items: {
                type: 'string',
                ref: 'courses',
            }
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

const db = RxDB.createRxDatabase({
    name: 'db/focusa',
    adapter: leveldown,
    multiInstance:false,
    eventReduce: false,
}).catch(e => console.error(e));

const focusa = db.then(db=> db.addCollections({
    auth: { schema: authSchema },
    courses: { schema: coursesSchema },
    roles: { schema: rolesSchema },
    posts: { schema: postsSchema },
    profile: { schema: profileSchema },
    auth_roles: { schema: auth_rolesSchema }
})).catch(e => console.error(e));

RxDB.addRxPlugin(require('pouchdb-adapter-http'));

const replicationState = async () =>
await collections.sync({
    remote,
    options: {
        live: true
    },
}).catch(e => console.error(e));

module.exports = {
    db, focusa, replicationState,
    assert, generateUUID
}