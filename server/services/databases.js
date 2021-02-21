/**
 * This file contains database instances,
 * along with push-pull replication handlers.
 * author: @yashdiniz
 */
const PouchDB = require("pouchdb");
PouchDB.plugin(require("pouchdb-find"));

const dbDirectory = 'db',   // the directory where DB is stored locally
    remote = 'http://admin:admin@localhost:5984/';	// the remote database to sync with!

// the list of local PouchDB databases
const logs = new PouchDB(path.join(dbDirectory, 'logs'));
const roles = new PouchDB(path.join(dbDirectory, 'roles'));
const auth = new PouchDB(path.join(dbDirectory, 'auth'));

// initiating push-pull replication with the remote CouchDB instance.
const syncHandlers = [
	{db:'logs', handler:logs.sync(new PouchDB(remote + 'logs'), {live: true})},
	{db:'auth', handler:auth.sync(new PouchDB(remote + 'auth'), {live: true})},
	{db:'roles', handler:roles.sync(new PouchDB(remote + 'roles'), {live: true})},
];

const sync = () => {
    syncHandlers.forEach(o => {
        o.handler.on('complete', 
            async ()=> console.log("Database", o.db, "synced.")
        ).on('error', e=>console.log(e));
    });
};

// initiate the replication
sync();

module.exports = {
    logs, auth, roles,

}