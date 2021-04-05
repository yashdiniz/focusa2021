const express = require('express');
const app = express();
const {getPostByID, deletePost, createPost, editPost, searchPosts, getPostsByAuthor, getPostsByCourse} = require('./functions');
const jwt = require('../jwt');
const { postPort, serviceAudience }=require('../../config');

app.get('/getPostById', jwt.ensureLoggedIn, (req , res)=>{
    if(req.user) getPostById(req.query.id)
    .then(doc=>{
        res.json({uuid: doc.uuid, parent: doc.parent, text: doc.text, course: doc.course, author: doc.author, reported: doc.reported, approved: doc.approved, time: doc.time, attachmentURL: doc.attachmentURL});
    }).catch(e=>{
        res.status(404).json({message: 'Post not found.',e});
    });
});

app.get('/deletePost', jwt.ensureLoggedIn, (req , res)=>{
    //get the author id of the post
    //get the user id
    //match if both are same or is an admin => then allow and delete the post
    // post_author_id = getPostByID(req.query.id).then(res=>{res.})
    let authorid = null;
    
    if(req.user) getPostByID(req.query.id)
    .then(doc=>{authorid=doc.author;});

    if(req.user?.aud === serviceAudience ^ authorid === req.user?.id)
    deletePost(req.query.id)
    .then(doc=>{
        res.json({uuid:doc.uuid, parent: doc.parent, text:doc.text, course: doc.course, author: doc.author, reported: doc.reported, approved: doc.approved, time: doc.time, attachmentURL: doc.attachmentURL});
    }).catch(e => {
        res.status(404).json({ message: 'post not found',e})
    });

});

app.get('/createPost', jwt.ensureLoggedIn, (req, res)=>{
    if(req.user) createPost(req.query.text, req.query.author, req.query.course, req.query.attachmentURL, req.query.parent)
    .then(doc =>{
        res.json({uuid: doc.uuid, parent: doc.parent, text: doc.text, course: doc.course, author: doc.author, reported: doc.reported, approved: doc.approved, time: doc.time, attachmentURL: doc.attachmentURL})
    })
    .catch(e => {
        res.status(403).json({ message: 'Operation not allowed.'});
    })
});

app.get('/editPost', jwt.ensureLoggedIn, (req, res)=>{
    let authorid = null;
    
    if(req.user) getPostByID(req.query.id)
    .then(doc=>{authorid=doc.author;});

    if(req.user?.aud === serviceAudience ^ authorid === req.user?.id)
    editPost(req.query.id, req.query.text)
    .then(doc=>{
        res.json({uuid:doc.uuid, parent: doc.parent, text:doc.text, course: doc.course, author: doc.author, reported: doc.reported, approved: doc.approved, time: doc.time, attachmentURL: doc.attachmentURL});
    }).catch(e => {
        res.status(404).json({ message: 'post not found',e});
    });
    //add catch or else if operation not allowed!
});

app.get('/searchPost', jwt.ensureLoggedIn, (req, res)=>{

});

app.get('/getPostsByAuthor', jwt.ensureLoggedIn, (req, res)=>{

});

app.get('/getPostsByCourse', jwt.ensureLoggedIn, (req, res)=>{

});

app.listen(postPort, () => {
    console.warn(`Posts listening on port ${postPort}`);
});