const express = require('express');
const app = express();
const {getPostByID, deletePost, createPost, editPost, searchPosts, getPostsByAuthor, getPostsByCourse} = require('./functions');
const jwt = require('../jwt');
const { postPort, serviceAudience }=require('../../config');

const isAdminUser = async (user) => {
    var admin = await auth.get('/userHasRole', {
        params: { user, role: 'admin' },
        headers: { authorization: token },
    })
    .then(res => res.data)
    .catch(e => undefined);
    return typeof admin !== 'undefined';
}

app.get('/getPostById', jwt.ensureLoggedIn, (req , res)=>{
    if(req.user) getPostById(req.query.id)
    .then(doc=>{
        res.json({uuid: doc.uuid, parent: doc.parent, text: doc.text, course: doc.course, author: doc.author, reported: doc.reported, approved: doc.approved, time: doc.time, attachmentURL: doc.attachmentURL});
    }).catch(e=>{
        res.status(404).json({message: 'Post not found.',e});
    });
});

app.get('/deletePost', jwt.ensureLoggedIn, async (req , res)=>{
    getPostByID(req.query.id)
    .then(post => {
        if(req.user?.aud === serviceAudience 
            ^ (post.author === req.user?.uuid || isAdminUser(req.user?.name)))
            return deletePost(req.query.id)
        else throw 'not authorized';
    }).then(doc=>{
        res.json({uuid:doc.uuid, parent: doc.parent, text:doc.text, course: doc.course, author: doc.author, reported: doc.reported, approved: doc.approved, time: doc.time, attachmentURL: doc.attachmentURL});
    }).catch(e => { 
        console.error(e);
        res.status(404).json({ message: 'post not found',e})
    });

});

app.get('/createPost', jwt.ensureLoggedIn, (req, res)=>{
    if(req.user) createPost(req.query.text, req.query.author, req.query.course, req.query.attachmentURL, req.query.parent)
    .then(doc =>{
        res.json({uuid: doc.uuid, parent: doc.parent, text: doc.text, course: doc.course, author: doc.author, reported: doc.reported, approved: doc.approved, time: doc.time, attachmentURL: doc.attachmentURL})
    })
    .catch(e => {
        res.status(403).json({ message: 'Operation not allowed.',e});
    });
});

app.get('/editPost', jwt.ensureLoggedIn, (req, res)=>{
    getPostByID(req.query.id)
    .then(post => {
        if(req.user?.aud === serviceAudience ^ post.author === req.user?.uuid)
            return editPost(req.query.id, req.query.text);
        else throw 'not authorized';
    }).then(doc=>{
        res.json({uuid:doc.uuid, parent: doc.parent, text:doc.text, course: doc.course, author: doc.author, reported: doc.reported, approved: doc.approved, time: doc.time, attachmentURL: doc.attachmentURL});
    }).catch(e => { 
        console.error(e);
        res.status(404).json({ message: 'Post not found.',e})
    });
});

app.get('/searchPosts', jwt.ensureLoggedIn, (req, res)=>{
    let posts = [];
    //currently returns the array of objects obtained from searchPosts functions
    if(req.user) searchPosts(req.query.q, req.query.offsetID)
    .then(docs=> {
        docs.forEach(doc => posts.push(doc));
        res.json({posts});
    })
    .catch(e => {
        res.status(404).json({ message: 'No post found.', e });
    });
});

app.get('/getPostsByAuthor', jwt.ensureLoggedIn, (req, res)=>{
    let posts = [];
    if(req.user) getPostsByAuthor(req.query.author)
    .then(docs => {
        docs.forEach(doc => posts.push(doc));
        res.json({posts});
    })
    .catch(e => {
        res.status(404).json({ message: 'No post found.', e});
    });
});

app.get('/getPostsByCourse', jwt.ensureLoggedIn, (req, res)=>{
    let posts = [];
    if(req.user) getPostsByCourse(req.query.id)
    .then(docs => {
        docs.forEach(doc => posts.push(doc));
        res.json({posts});
    })
    .catch(e => {
        res.status(404).json({ message: 'No post found.', e});
    });
});

app.listen(postPort, () => {
    console.warn(`Posts listening on port ${postPort}`);
});