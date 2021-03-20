const {focusa, assert, generateUUID} = require('../databases');

const noSuchPost = new Error('Post with such id does not exist');

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
    let time = new Date();

    let f = await focusa;

    return await f.posts.insert({
        uuid, parent, text, course, author,
        reported: false,
        approved: false,
        time, attachmentURL    
    });
}

//to be done: editpost function

const editPost = async (uuid, text) => {
    assert(typeof uuid === 'string' && typeof text === 'string');

    let f = await focusa;

    let post = await f.posts.findOne(uuid).exec();

    console.log("Post is getting edited");

    return await post.atomicPatch({
        text
    });
    

}

module.exports = {getPostByID, deletePost, createPost, editPost};