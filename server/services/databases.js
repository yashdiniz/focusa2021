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
            default: false,
        },
        approved: {
            type: 'number',
            default: true,
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
    required: ['fullName', 'about', 'display_pic']
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
    indexes: ['user_roleID'],
    required: ['user_roleID', 'user', 'role'],
};

const db = RxDB.createRxDatabase({
    name: 'db/focusa',
    adapter: leveldown,
    multiInstance: true,
    eventReduce: false,
}).catch(console.error);

const focusa = db.then(db=> db.addCollections({
    auth: { schema: authSchema },
    user: { schema: userSchema },
    courses: { schema: coursesSchema },
    roles: { schema: rolesSchema },
    posts: { schema: postsSchema },
    profile: { schema: profileSchema },
    user_roles: { schema: user_rolesSchema },
})).catch(console.error);

RxDB.addRxPlugin(require('pouchdb-adapter-http'));

const replicationState = async () =>
await focusa.then(focusa => {
    let collections = Object.keys(focusa);
    let syncs = [];
    for (var c in collections)
        syncs.push(focusa[collections[c]].sync({
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