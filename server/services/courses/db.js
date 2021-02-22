const { logs, courses, assert } = require('../databases');

var PouchDB = require("pouchdb");   

function addcourse(name, description, mods){


}

// document that tells PouchDB/CouchDB
// to build up an index on doc.name
var ddoc = {
    _id: '_design/my_index',
    views: {
      by_name: {
        map: function (doc) { emit(doc.name); }.toString(),
        reduce: '_count'
      }
    }
  };
  // save it
  courses.put(ddoc).then(function () {
    // success!s
  }).catch(function (err) {
    // some error (maybe a 409, because it already exists?)
  });