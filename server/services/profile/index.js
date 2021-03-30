const express = require('express');
const app = express();
const { profilePort, JWTsignOptions, serviceAuthPass, serviceAudience, authRealm } = require('../../config');
const { getProfile, updateProfile, deleteProfile } = require('./functions');
const jwt = require('../jwt');

const { create } = require('axios');
let token = '';
const auth = create({
    baseURL: `${authRealm}`,
    timeout: 5000,
});
let loginDetails = Buffer.from(`profile:${serviceAuthPass}`).toString('base64');
auth.get('/', {
    headers: {authorization: `Basic ${loginDetails}`}
}).then(res => token = res.data.token);
setInterval(() => auth.get('/', {
    headers: {authorization:`Basic ${loginDetails}`}
}).then(res => token = res.data.token), (JWTsignOptions.expiresIn-10)*1000);

app.get('/getProfile', jwt.ensureLoggedIn, (req, res) => {
    if(req.user) getProfile(req.query.id)
    .then(doc => res.json({ userID: doc.userID, 
        fullName: doc.fullName, 
        about: doc.about, 
        interests: doc.interests,
        display_pic: doc.display_pic, 
    })).catch(e => {
        res.status(404).json({ message: 'Profile not found.', e });
    });
});

app.get('/updateProfile', jwt.ensureLoggedIn, async (req, res) => {
    if (req.user?.aud === serviceAudience
        ^ typeof await auth.get('/userHasRole', {
            params: { user: req.user?.name, role: 'admin' },
            headers: { authorization: token },
        }).then(r => r.data).catch(e => undefined) !== 'undefined') {
        updateProfile(req.query.id, req.query.fullName, req.query.about, req.query.display_pic)
        .then(doc => res.json({ userID: doc.userID, 
            fullName: doc.fullName, 
            about: doc.about, 
            interests: doc.interests,
            display_pic: doc.display_pic, 
        })).catch(e => {
            res.status(404).json({ message: 'Profile not found.', e });
        });
    } else res.status(403).json({ message: 'Operation not allowed.' });
});


app.get('/deleteProfile', jwt.ensureLoggedIn, async (req, res) => {
    if (req.user?.aud === serviceAudience
        ^ typeof await auth.get('/userHasRole', {
            params: { user: req.user?.name, role: 'admin' },
            headers: { authorization: token },
        }).then(r => r.data).catch(e => undefined) !== 'undefined') {
        deleteProfile(req.query.id)
        .then(doc => res.json({ userID: doc.userID, 
            fullName: doc.fullName, 
            about: doc.about, 
            interests: doc.interests,
            display_pic: doc.display_pic, 
        })).catch(e => {
            res.status(404).json({ message: 'Profile not found.', e })
        });
    } else res.status(403).json({ message: 'Operation not allowed.' });
});

app.listen(profilePort, () => {
    console.warn(`Profile listening on port ${ profilePort }`);
});