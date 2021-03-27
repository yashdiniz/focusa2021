const express = require('express');
const app = express();
const { coursesPort } = require('../../config');
const { getCourseById, getCourseByName, addCourse, updateCourse,  } = require('./functions');
const jwt = require('../jwt');


app.get('/getCourseById', jwt.ensureLoggedIn, (req, res) => {
    if (req.user) getCourseById(req.query.id)
        .then(doc => {
            res.json({ name: doc.name, uuid: doc.uuid });
        }).catch(e => {
            res.status(404).json({ message: 'course not found.', e });
        })
})

app.get('/getCourseByName', jwt.ensureLoggedIn, (req, res) => {
    if (req.user) getCourseByName(req.query.name)
        .then(doc => {
            res.json({ name: doc.name, uuid: doc.uuid });
        }).catch(e => {
            res.status(404).json({ message: 'course not found', e })
        })
});


app.get('/addCourse', jwt.ensureLoggedIn, (req, res) => {

    if (req.user?.aud === serviceAudience
        && getRolesOfUser(req.user?.name).find(doc => doc.name === 'admin')) {

        addCourse(req.query.name, req.query.description)
            .then(doc => {
                res.json({ name: doc.name, uuid: doc.uuid });
            }).catch(e => {
                res.status(404).json({ message: 'course not found', e })
            })
    }

    else res.status(403).json({ message: 'Operation not allowed.' });
});

app.get('/updateCourse', jwt.ensureLoggedIn, (req, res) => {
    if (req.user?.aud === serviceAudience
        && getRolesOfUser(req.user?.name).find(doc => doc.name === 'admin')) {
            updateCourse(req.query.id, req.query.name, req.query.description)
            .then(doc => {
                res.json({ name: doc.name, uuid: doc.uuid });
            }).catch(e => {
                res.status(404).json({ message: 'course not found', e })
            })
        }
        else res.status(403).json({ message: 'Operation not allowed.' });
    
});

app.get('/deleteCourse', jwt.ensureLoggedIn, (req, res) => {
    if (req.user?.aud === serviceAudience
        && getRolesOfUser(req.user?.name).find(doc => doc.name === 'admin')) {
            deleteCourse(req.query.id)
            .then(doc => {
                res.json({ name: doc.name, uuid: doc.uuid });
            }).catch(e => {
                res.status(404).json({ message: 'course not found', e })
            })
        }

        else res.status(403).json({ message: 'Operation not allowed.' });
});


app.listen(coursesPort, () => {
    console.warn(`Courses listening on port ${coursesPort}`);
})