const express = require('express');
const app = express();
const { profilePort, secret, JWTsignOptions, serviceAuthPass, serviceAudience } = require('../../config');
const { getProfile } = require('./functions');
const jwt = require('../jwt');

app.get('/getProfile', jwt.ensureLoggedIn, (req, res) => {
    if(req.user) getProfile(req.query.id)
    .then(doc => res.json({ userID: doc.userProfileID, fullName: doc.fullName, about: doc.about, interests: doc.interests}))
    .catch(e => res.status(404).json({ message: 'User not found.', e }));
});

app.listen(profilePort, () => {
    console.warn(`Profile listening on port ${ profilePort }`);
});