const express = require('express');
const app = express();
const { coursesPort } = require('../../config');
const { getCourseById, getCourseByName } = require('./functions');
const jwt = require('../jwt');


app.get('/getCourseById', jwt.ensureLoggedIn, (req , res)=>{
    if(req.user) getCourseById(req.query.id)
    .then(doc=>{
        res.json({name:doc.name, uuid: doc.uuid});
    }).catch(e=>{
        res.status(404).json({message: 'course not found.',e});
    })
})

app.get('/getCourseByName', jwt.ensureLoggedIn, (req, res)=>{
    if(req.user) getCourseByName(req.query.name)
    .then(doc=>{
        res.json({name: doc.name, uuid: doc.uuid});
    }).catch(e=>{
        res.status(404).json({message: 'course not found', e})
    })
} );

app.listen(coursesPort, () => {
    console.warn(`Courses listening on port ${ coursesPort }`);
})