/**
 * This file contains database instances,
 * along with push-pull replication handlers.
 * author: @yashdiniz
 */
const path = require('path'), crypto = require('crypto');
const { UUIDSize } = require('../config');
const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));

const dbDirectory = 'db',   // the directory where DB is stored locally
    remote = 'http://admin:admin@localhost:5984/';	// the remote database to sync with!

// the list of local PouchDB databases
const logs = new PouchDB(path.join(dbDirectory, 'logs'));
const roles = new PouchDB(path.join(dbDirectory, 'roles'));
const auth = new PouchDB(path.join(dbDirectory, 'auth'));
const courses = new PouchDB(path.join(dbDirectory, 'courses'));

// initiating push-pull replication with the remote CouchDB instance.
const syncHandlers = [
	{db:'logs', handler:logs.sync(new PouchDB(remote + 'logs'), {live: true})},
	{db:'auth', handler:auth.sync(new PouchDB(remote + 'auth'), {live: true})},
    {db:'roles', handler:roles.sync(new PouchDB(remote + 'roles'), {live: true})},
    {db:'courses', handler:courses.sync(new PouchDB(remote + 'courses'), {live: true})},
];

const sync = () => {
    syncHandlers.forEach(o => {
        o.handler.on('complete', 
            async ()=> console.log('Database', o.db, 'synced.')
        ).on('error', e=>console.log(e));
    });
};

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
sync();

module.exports = {
    logs, auth, roles, courses,
    assert, generateUUID
}