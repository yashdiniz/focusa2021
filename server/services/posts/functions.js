/**
 * Functions required for interacting with 
 * Posts collection in CRUD fashion.
 * author: @PranavParanjape
 */

const {focusa, assert, generateUUID} = require('../databases');
const { authRealm, serviceAuthPass, JWTsignOptions } = require('../../config');


const noSuchPost = new Error('Post with such id does not exist');
const noPostsYet = new Error('There are no posts yet!');
const noSuchAuthor = new Error('There exists no author with the given name!');
const noSuchCourse = new Error('There is no course with the given name');

const {create} = require('axios');
let token = '';
const auth = create({
    baseURL: `${authRealm}`,
    timeout: 5000,
});

let loginDetails = Buffer.from(`posts:${serviceAuthPass}`).toString('base64');
auth.get('/', {
    headers: {authorization: `Basic ${loginDetails}`}
    }).then(res => token = res.data.token);
setInterval(() => auth.get('/', {
headers: {authorization:`Basic ${loginDetails}`}
})
.then(res => token = res.data.token), (JWTsignOptions.expiresIn-10)*1000);

/**
 * Gets the post with matching UUID.
 * @param {string} uuid uuid of the post.
 * @returns Post with the specified ID
 */
const getPostByID = async (uuid) => {
    assert(typeof uuid === 'string', "Invalid post id");

    let f = await focusa;
    return await f.posts.findOne(uuid).exec()
    .then(async doc => {
        if(doc) {
            return doc;
        }
        else throw noSuchPost;
    });
}

/**
 * Delete an existing post from the database.
 * @param {string} uuid uuid of the post.
 */
const deletePost = async (uuid) => {
    assert(typeof uuid === 'string', "Invalid post id");

    let f = await focusa;
    return await f.posts.findOne(uuid).exec()
    .then(async doc => {
        if(doc){
            doc.remove();
            console.log("post removed successfully!");
        }
        else throw noSuchPost;
    });
}

/**
 * Create a new post
 * @param {string} text the content of the post
 * @param {string} author the author of the post
 * @param {string} course the course to which the post belongs
 * @param {string} attachmentURL any attachment for reference
 * @param {string} parent the parent post of this post
 */
const createPost = async (text, author, course, attachmentURL, parent ) => {
    assert(typeof text === 'string' && typeof author === 'string' && typeof course === 'string' && typeof attachmentURL === 'string' && typeof parent === 'string');
    
    let uuid = generateUUID();
    let time = Date.now();

    let f = await focusa;

    return await f.posts.insert({
        uuid, parent, text, course, author,
        time, attachmentURL    
    });
}

/**
 * Edit a post with a given ID
 * @param {string} uuid ID of the post 
 * @param {string} text the new contents of the post
 */
const editPost = async (uuid, text) => {
    assert(typeof uuid === 'string' && typeof text === 'string');

    let f = await focusa;

    let post = await f.posts.findOne(uuid).exec();

    console.log("Post is getting edited");

    return await post.atomicPatch({
        text
    });
    

}

/**
 * Searches for posts with a matching query in text body.
 * @param {string} query Query string to search posts. Empty for all posts.
 * @returns top 10 posts 
 */
const searchPosts = async (query, offsetID) => {
    // for now implement only implement empty query
    // add limit to only view top 10 (store as var in config) posts...
    let f = await focusa;

    return await f.posts.find().skip(offsetID).limit(10).exec()
    .then(async d => {
        if(d) return d;
        else throw noPostsYet;
    });
}
/**
 * Searches for all posts made by a particular author
 * @param {string} author author name
 * @returns all the posts made by the author
 */
const getPostsByAuthor = async (author) => {
    assert(typeof author === 'string');

    let f = await focusa;

    let authorID = await auth.get('/getUserByName', {
        params: {name: author},
        headers: { authorization: token }
    }).then(res => res.data.uuid);
    return await f.posts.find().where('author').eq(authorID)
    .then(async doc => {
        if(doc) return doc;
        else throw noSuchAuthor;
    })
}

/**
 * Get posts of a particular course
 * @param {string} course the course name
 * @returns all the posts under a particular course
 */
const getPostsByCourse = async (course) => {
    assert(typeof course === 'string');

    let f = await focusa;

    return await f.posts.find(course).exec()
    .then(async doc => {
        if(doc) return doc;
        else throw noSuchCourse;
    })
}

module.exports = {getPostByID, deletePost, createPost, editPost, searchPosts, getPostsByAuthor, getPostsByCourse};