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
    post_author_id = getPostByID(req.query.id).then(res=>{res.})
    if(req.user?.aud === serviceAudience ^ )
})

app.listen(postPort, () => {
    console.warn(`Posts listening on port ${postPort}`);
})