const express = require('express');
const app = express();
const { coursesPort, serviceAudience, serviceAuthPass, JWTsignOptions, authRealm } = require('../../config');
const { getCourseById, getCourseByName, addCourse, updateCourse, deleteCourse } = require('./functions');
const jwt = require('../jwt');

const { create } = require('axios');
let token = '';
const auth = create({
    baseURL: `${authRealm}`,
    timeout: 5000,
});
let loginDetails = Buffer.from(`courses:${serviceAuthPass}`).toString('base64');
auth.get('/', {
    headers: `Basic ${loginDetails}`
}).then(res => token = res.data.token);
setInterval(() => auth.get('/', {
    headers: `Basic ${loginDetails}`
}).then(res => token = res.data.token), (JWTsignOptions.expiresIn-10)*1000);


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


app.get('/addCourse', jwt.ensureLoggedIn, async (req, res) => {
    if (req.user?.aud === serviceAudience
        ^ await auth.get('/getRolesOfUser', {
            params: { name: req.user?.name },
            headers: { authorization: token },
        }).then(res => res.data.find(doc => doc.name === 'admin'))) {
        addCourse(req.query.name, req.query.description)
            .then(doc => {
                res.json({ name: doc.name, uuid: doc.uuid });
            }).catch(e => {
                res.status(404).json({ e })
            })
    }

    else res.status(403).json({ message: 'Operation not allowed.' });
});

app.get('/updateCourse', jwt.ensureLoggedIn, async (req, res) => {
    if (req.user?.aud === serviceAudience
        ^ await auth.get('/getRolesOfUser', {
            params: { name: req.user?.name },
            headers: { authorization: token },
        }).then(res => res.data.find(doc => doc.name === 'admin'))) {
            updateCourse(req.query.id, req.query.name, req.query.description)
            .then(doc => {
                res.json({ name: doc.name, uuid: doc.uuid });
            }).catch(e => {
                res.status(404).json({ message: 'course not found', e })
            })
        }
        else res.status(403).json({ message: 'Operation not allowed.' });
    
});

app.get('/deleteCourse', jwt.ensureLoggedIn, async (req, res) => {
    if (req.user?.aud === serviceAudience
        ^ await auth.get('/getRolesOfUser', {
            params: { name: req.user?.name },
            headers: { authorization: token },
        }).then(res => res.data.find(doc => doc.name === 'admin'))) {
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