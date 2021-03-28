const express = require('express');
const app = express();
const { coursesPort, serviceAudience, serviceAuthPass, JWTsignOptions, authRealm } = require('../../config');
const { getCourseById, getCoursesByName, addCourse, updateCourse, deleteCourse } = require('./functions');
const jwt = require('../jwt');

const { create } = require('axios');
let token = '';
const auth = create({
    baseURL: `${authRealm}`,
    timeout: 5000,
});
let loginDetails = Buffer.from(`courses:${serviceAuthPass}`).toString('base64');
auth.get('/', {
    headers: {authorization: `Basic ${loginDetails}`}
}).then(res => token = res.data.token);
setInterval(() => auth.get('/', {
    headers: {authorization:`Basic ${loginDetails}`}
}).then(res => token = res.data.token), (JWTsignOptions.expiresIn-10)*1000);


app.get('/getCourseById', jwt.ensureLoggedIn, (req, res) => {
    if (req.user) getCourseById(req.query.id)
        .then(doc => {
            res.json({ name: doc.name, uuid: doc.uuid, description: doc.description, mods: doc.mods });
        }).catch(e => {
            res.status(404).json({ message: 'course not found.', e });
        })
})

app.get('/getCoursesByName', jwt.ensureLoggedIn, (req, res) => {
    if (req.user) getCoursesByName(req.query.name)
        .then((docs) => {
            res.json(
                docs.map(doc => ({ name: doc.name, 
                uuid: doc.uuid, 
                description: doc.description, 
                mods: doc.mods })
                )
            );
        }).catch(e => {
            res.status(404).json({ message: 'course not found', e })
        })
});


app.get('/addCourse', jwt.ensureLoggedIn, async (req, res) => {
    if (req.user?.aud === serviceAudience
        ^ typeof await auth.get('/userHasRole', {
            params: { user: req.user?.name, role: 'admin' },
            headers: { authorization: token },
        }).then(r => r.data).catch(e => undefined) !== 'undefined') {
        addCourse(req.query.name, req.query.description)
            .then(doc => {
                res.json({ name: doc.name, uuid: doc.uuid, description: doc.description, mods: doc.mods });
            }).catch(e => {
                res.status(404).json({ e })
            })
    } else res.status(403).json({ message: 'Operation not allowed.' });
});

app.get('/updateCourse', jwt.ensureLoggedIn, async (req, res) => {
    if (req.user?.aud === serviceAudience
        ^ typeof await auth.get('/userHasRole', {
            params: { user: req.user?.name, role: 'admin' },
            headers: { authorization: token },
        }).then(r => r.data).catch(e => undefined) !== 'undefined') {
            updateCourse(req.query.id, req.query.name, req.query.description)
            .then(doc => {
                res.json({ name: doc.name, uuid: doc.uuid, description: doc.description, mods: doc.mods });
            }).catch(e => {
                res.status(404).json({ message: 'course not found', e })
            })
        }
        else res.status(403).json({ message: 'Operation not allowed.' });
    
});

app.get('/deleteCourse', jwt.ensureLoggedIn, async (req, res) => {
    if (req.user?.aud === serviceAudience
        ^ typeof await auth.get('/userHasRole', {
            params: { user: req.user?.name, role: 'admin' },
            headers: { authorization: token },
        }).then(r => r.data).catch(e => undefined) !== 'undefined') {
            deleteCourse(req.query.id)
            .then(doc => {
                res.json({ name: doc.name, uuid: doc.uuid, description: doc.description, mods: doc.mods });
            }).catch(e => {
                res.status(404).json({ message: 'course not found', e })
            })
        }
        else res.status(403).json({ message: 'Operation not allowed.' });
});


app.listen(coursesPort, () => {
    console.warn(`Courses listening on port ${coursesPort}`);
})