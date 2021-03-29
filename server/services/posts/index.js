const express = require('express');
const app = express();
const {getPostByID, deletePost, createPost, editPost, searchPosts, getPostsByAuthor, getPostsByCourse} = require('./functions');
const jwt = require('../jwt');

app.get('/getPostById', jwt.ensureLoggedIn, (req , res)=>{
    if(req.user) getPostById(req.query.id)
    .then(doc=>{
        res.json({uuid: doc.uuid, parent: doc.parent, text: doc.text, course: doc.course, author: doc.author, reported: doc.reported, approved: doc.approved, time: doc.time, attachmentURL: doc.attachmentURL});
    }).catch(e=>{
        res.status(404).json({message: 'Post not found.',e});
    });
});