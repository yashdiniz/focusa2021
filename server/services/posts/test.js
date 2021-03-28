//var db = require('../databases');
var post =  require('./functions');
//var auth = require('../auth/functions');

function cgetPostsByAuthor(author_name){
    return res = post.getPostsByAuthor(author_name).then(c => {console.log(c[0])});
    }

module.exports = {cgetPostsByAuthor};