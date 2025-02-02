/**
 * Functions required for interacting with 
 * Posts collection in CRUD fashion.
 * author: @PranavParanjape
 */
const { focusa, assert, generateUUID } = require('../databases');
const path = require('path');
const { authRealm, serviceAuthPass, JWTsignOptions, pageLimit, minPostBodyLength, UUIDpattern, maxPostBodyLength, coursesRealm, filesRealm } = require('../../config');
const { PubSub } = require('../../libp2p-pubsub');

const noSuchPost = new Error('Post with such id does not exist');
const noPostsFound = new Error('There are no matching posts found!');
const noSuchAuthor = new Error('There exists no author with the given name!');
const noSuchCourse = new Error('There is no course with the given name');

const notification = new PubSub();   // creating a notification publisher

const { create } = require('axios');
let token = '';
const auth = create({
    baseURL: `${authRealm}`,
    timeout: 5000,
});
const courses = create({
    baseURL: `${coursesRealm}`,
    timeout: 5000,
});
const files = create({
    baseURL: `${filesRealm}`,
    timeout: 5000,
});

let loginDetails = Buffer.from(`posts:${serviceAuthPass}`).toString('base64');
auth.get('/', {
    headers: { authorization: `Basic ${loginDetails}` }
}).then(res => token = res.data.token);
setInterval(() => auth.get('/', {
    headers: { authorization: `Basic ${loginDetails}` }
})
    .then(res => token = res.data.token), (JWTsignOptions.expiresIn - 10) * 1000);

/**
 * Attempt to build a TF-IDF index for post text.
 * Will be used in searchPosts
 */
focusa.then(f => f.posts.pouch.search({
    fields: ['text'],
    build: true,
})).catch(console.error);


/**
 * Gets the post with matching UUID.
 * @param {string} uuid uuid of the post.
 * @returns Post with the specified ID
 */
const getPostById = async (uuid) => {
    assert(typeof uuid === 'string'
        && UUIDpattern.test(uuid),
        "Invalid post ID at getPostById.");

    let f = await focusa;

    return await f.posts.findOne(uuid).exec()
        .then(async doc => {
            if (doc) return doc;
            else throw noSuchPost;
        });
}

/**
 * Extracts and returns Qmhash from a URL: eg. http://localhost/ipfs/Qmhash/file.pdf
 * @param {string} url The URL to extract the CID
 * @returns {string} The CID.
 */
function parseCIDFromURL(url) {
    let parsedURL = new URL(url);
    let parsedPath = parsedURL.pathname.replace('/ipfs/', '').split('/');
    // eg. pathname: /ipfs/Qmhash/file.pdf
    // parsedPath: [ 'Qmhash', 'file.pdf' ]
    return parsedPath[0];
}

/**
 * Delete an existing post from the database.
 * @param {string} uuid uuid of the post.
 */
const deletePost = async (uuid) => {
    assert(typeof uuid === 'string'
        && UUIDpattern.test(uuid),
        "Invalid post ID at deletePost.");

    let f = await focusa;

    return await f.posts.findOne(uuid).exec()
        .then(async doc => {
            if (doc) {
                if (doc.attachmentURL) {
                    files.get('/unpin', {
                        params: { cid: parseCIDFromURL(path.join(filesRealm, doc.attachmentURL)) },
                        headers: { authorization: token }
                    }).then(res => res.data)
                        .catch(e => console.error(new Date(), e));
                }

                doc.remove();
                return doc;
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
const createPost = async (text, author, course, attachmentURL, parent) => {
    assert(typeof text === 'string'
        && typeof author === 'string'
        && typeof course === 'string'
        && typeof attachmentURL === 'string'
        && typeof parent === 'string',
        "Invalid arguments for createPost.");
    assert(!(parent.length > 0 && course.length > 0),
        "Comments cannot have a course.");
    assert(parent.length == 0 || await getPostById(parent).catch(e => false),
        "Parent post does not exist.");
    assert(text.length >= minPostBodyLength, "Post content is too short.");
    assert(text.length <= maxPostBodyLength, "Post content is too long.");

    let uuid = generateUUID();
    let time = Date.now();
    let f = await focusa;

    if (course.length > 0)
        await courses.get('/getCourseById', { // check if the course ID exists
            params: { id: course },
            headers: { authorization: token }
        }).then(res => res.data);

    auth.get('/getUserById', {
        params: { id: author },
        headers: { authorization: token }
    }).then(res => res.data)
        .then(data => notification.publish(generateUUID(), 'postAdded', course, `${data.name} has posted!`, `post/${uuid}`))
        .catch(console.error);

    if (attachmentURL) {
        files.get('/pin', {
            params: { cid: parseCIDFromURL(path.join(filesRealm, attachmentURL)) },
            headers: { authorization: token }
        }).then(res => res.data)
            .catch(e => console.error(new Date(), e));
    }

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
    assert(typeof uuid === 'string'
        && typeof text === 'string'
        && UUIDpattern.test(uuid),
        "Invalid arguments for editPost.");
    assert(text.length >= minPostBodyLength, "Post content is too short.");
    assert(text.length <= maxPostBodyLength, "Post content is too long.");

    let f = await focusa;

    return await f.posts.findOne(uuid).exec()
        .then(doc => doc.atomicPatch({
            text, time: Date.now()
        }));
}

/**
 * Searches for posts with a matching query in text body.
 * @param {string} offset ID to skip to, and continue searching from.
 * @param {string} query Query string to search posts. Empty for all posts.
 * @returns top 10 posts 
 */
const searchPosts = async (query, offset) => {
    let f = await focusa;

    // TF-IDF text search
    return await f.posts.pouch.search({
        query,
        fields: ['text'],
        include_docs: true,
        mm: '50%',
        limit: pageLimit, skip: offset,
    })
        .then(async o => await f.posts.findByIds(o.rows.map(e => e.doc?._id))) // to convert to RxDocuments
        .then(docs => Array.from(docs, ([key, value]) => value));
}
/**
 * Searches for all posts made by a particular author
 * @param {string} authorID author ID
 * @returns all the posts made by the author
 */
const getPostsByAuthor = async (authorID, offset) => {
    assert(typeof authorID === 'string'
        && UUIDpattern.test(authorID),
        "Invalid arguments for getPostsByAuthor.");
    let f = await focusa;
    return await f.posts.find().where('author').eq(authorID)
        .where('reported').eq(0)
        .where('approved').eq(1)
        .sort({ time: 'desc' })
        .skip(offset).limit(pageLimit).exec()
        .then(async docs => {
            if (docs) return docs;
            else throw noSuchAuthor;
        });
}

/**
 * Get posts of a particular course
 * @param {string} courseID the course ID.
 * @returns all the posts under a particular course
 */
const getPostsByCourse = async (courseID, offset) => {
    assert(typeof courseID === 'string'
        && UUIDpattern.test(courseID),
        "Invalid arguments for getPostsByCourse.");
    let f = await focusa;
    return await f.posts.find().where('course').eq(courseID)
        .where('reported').eq(0)
        .where('approved').eq(1)
        .sort({ time: 'desc' })
        .skip(offset).limit(pageLimit).exec()
        .then(async docs => {
            if (docs) return docs;
            else throw noSuchCourse;
        });
}

/**
 * Gets posts which are comments to a particular parent post.
 * @param {string} parentID The ID of the parent post.
 * @returns All the posts with a matching parent ID.
 */
const getPostsByParent = async (parentID, offset) => {
    assert(typeof parentID === 'string'
        && UUIDpattern.test(parentID),
        "Invalid arguments for getPostsByParent.");
    let f = await focusa;
    return await f.posts.find().where('parent').eq(parentID)
        .where('reported').eq(0)
        .where('approved').eq(1)
        .sort({ time: 'desc' })
        .skip(offset).limit(pageLimit).exec()
        .then(async docs => {
            if (docs) return docs;
            else throw noSuchPost;
        });
}

// TODO: Add provision for reporting and approving posts. Future scope?
// TODO: Also provision for searching reported and unapproved posts?

module.exports = { getPostById, deletePost, createPost, editPost, searchPosts, getPostsByAuthor, getPostsByCourse, getPostsByParent };
