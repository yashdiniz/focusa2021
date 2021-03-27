const {focusa, assert, generateUUID} = require('../databases');

const noSuchPost = new Error('Post with such id does not exist');
const noPostsYet = new Error('There are no posts yet!');
const noSuchAuthor = new Error('There exists no author with the given name!');
const noSuchCourse = new Error('There is no course with the given name');
/**
 * Gets the post with matching UUID.
 * @param {string} uuid uuid of the post.
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

const getPostsByAuthor = async (author) => {
    assert(typeof author === 'string');

    let f = await focusa;

    return await f.posts.find(author).exec()
    .then(async doc => {
        if(doc) return doc;
        else throw noSuchAuthor;
    })
}

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