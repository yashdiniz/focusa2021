const express = require('express');
const app = express();
const {getPostById, deletePost, createPost, editPost, searchPosts, getPostsByAuthor, getPostsByCourse} = require('./functions');
const jwt = require('../jwt');
const { postPort, serviceAudience }=require('../../config');

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

app.get('/searchPosts', jwt.ensureLoggedIn, (req, res)=>{
    //currently returns the array of objects obtained from searchPosts functions
    if(req.user) searchPosts(req.query.q, req.query.offsetID)
    .then(docs=> {
        let posts = // not necessary, can use docs.map...
        docs.map(doc => ({uuid: doc.uuid, parent: doc.parent, text: doc.text, course: doc.course, author: doc.author, reported: doc.reported, approved: doc.approved, time: doc.time, attachmentURL: doc.attachmentURL}))
        //docs.forEach(doc => posts.push(doc));
        res.json(posts);  // TODO: graphql expects array of objects... Response has object wrapping array
    })
    .catch(e => {
        res.status(404).json({ message: 'No post found.', e });
    });
});

app.get('/getPostsByAuthor', jwt.ensureLoggedIn, (req, res)=>{
    if(req.user) getPostsByAuthor(req.query.id)
    .then(docs => {
        let posts = // not necessary, can use docs.map...
        docs.map(doc => ({uuid: doc.uuid, parent: doc.parent, text: doc.text, course: doc.course, author: doc.author, reported: doc.reported, approved: doc.approved, time: doc.time, attachmentURL: doc.attachmentURL}))
        //docs.forEach(doc => posts.push(doc));
        res.json(posts);  // TODO: graphql expects array of objects... Response has object wrapping array
    })
    .catch(e => {
        res.status(404).json({ message: 'No post found.', e});
    });
});

app.get('/getPostsByCourse', jwt.ensureLoggedIn, (req, res)=> {
    if(req.user) getPostsByCourse(req.query.id)
    .then(docs => {
        let posts = // not necessary, can use docs.map...
        docs.map(doc => ({uuid: doc.uuid, parent: doc.parent, text: doc.text, course: doc.course, author: doc.author, reported: doc.reported, approved: doc.approved, time: doc.time, attachmentURL: doc.attachmentURL}))
        //docs.forEach(doc => posts.push(doc));
        res.json(posts);  // TODO: graphql expects array
    })
    .catch(e => {
        res.status(404).json({ message: 'No post found.', e});
    });
});

app.get('/getPostById', jwt.ensureLoggedIn, (req , res)=>{
    if(req.user) getPostById(req.query.id)
    .then(doc=>{
        res.json({uuid: doc.uuid, parent: doc.parent, text: doc.text, course: doc.course, author: doc.author, reported: doc.reported, approved: doc.approved, time: doc.time, attachmentURL: doc.attachmentURL});
    }).catch(e=>{
        res.status(404).json({message: 'Post not found.',e});
    });
});

app.get('/createPost', jwt.ensureLoggedIn, (req, res)=>{
    // authorID is obtained from session: req.user?.uuid
    if(req.user) createPost(req.query.text, req.user?.uuid, req.query.course, req.query.attachmentURL, req.query.parent)
    .then(doc =>{
        res.json({uuid: doc.uuid, parent: doc.parent, text: doc.text, course: doc.course, author: doc.author, reported: doc.reported, approved: doc.approved, time: doc.time, attachmentURL: doc.attachmentURL})
    })
    .catch(e => {
        res.status(404).json({ message: 'Cannot create post.',e});
    });
    else res.status(403).json({ message: 'Operation not allowed.' });
});

const isAdminUser = async (user) => {
    var admin = await auth.get('/userHasRole', {
        params: { user, role: 'admin' },
        headers: { authorization: token },
    })
    .then(res => res.data)
    .catch(e => undefined);
    return typeof admin !== 'undefined';
}

app.get('/deletePost', jwt.ensureLoggedIn, async (req , res)=>{
    getPostById(req.query.id)   // getPostByID used to get author ID for validating the request
    .then(post => {
        if(req.user?.aud === serviceAudience 
            ^ (post.author === req.user?.uuid || await isAdminUser(req.user?.name)))
            return deletePost(req.query.id)
        else throw 'not authorized';
    }).then(doc=>{
        res.json({uuid:doc.uuid, parent: doc.parent, text:doc.text, course: doc.course, author: doc.author, reported: doc.reported, approved: doc.approved, time: doc.time, attachmentURL: doc.attachmentURL});
    }).catch(e => { 
        res.status(404).json({ message: 'post not found',e})
    });

});

app.get('/editPost', jwt.ensureLoggedIn, (req, res)=>{
    getPostById(req.query.id)   // getPostByID used to get author ID for validating the request
    .then(post => {
        if(req.user?.aud === serviceAudience 
            ^ (post.author === req.user?.uuid || await isAdminUser(req.user?.name)))
            return editPost(req.query.id, req.query.text);
        else throw 'not authorized';
    }).then(doc=>{
        res.json({uuid:doc.uuid, parent: doc.parent, text:doc.text, course: doc.course, author: doc.author, reported: doc.reported, approved: doc.approved, time: doc.time, attachmentURL: doc.attachmentURL});
    }).catch(e => { 
        res.status(404).json({ message: 'Post not found.',e})
    });
});

app.listen(postPort, () => {
    console.warn(`Posts listening on port ${postPort}`);
});