const express = require('express');
const app = express();
const { profilePort, JWTsignOptions, serviceAuthPass, serviceAudience, authRealm } = require('../../config');
const { getProfile, updateProfile, deleteProfile, addInterest, removeInterest, profileHasInterest, getInterestsOfProfile, getProfilesWithInterest } = require('./functions');
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

app.get('/addInterest', jwt.ensureLoggedIn, async (req, res) => {
    if (req.user) addInterest(req.user?.uuid, req.query.courseID)
    .then(doc => res.json({ userID: doc.userID, 
        fullName: doc.fullName, 
        about: doc.about, 
        interests: doc.interests,
        display_pic: doc.display_pic, 
    })).catch(e => {
        res.status(404).json({ message: 'Not found.', e });
    });
});

app.get('/removeInterest', jwt.ensureLoggedIn, async (req, res) => {
    if (req.user) removeInterest(req.user?.uuid, req.query.courseID)
    .then(doc => res.json({ userID: doc.userID, 
        fullName: doc.fullName, 
        about: doc.about, 
        interests: doc.interests,
        display_pic: doc.display_pic, 
    })).catch(e => {
        res.status(404).json({ message: 'Not found.', e });
    });
});

app.get('/profileHasInterest', jwt.ensureLoggedIn, async (req, res) => {
    if (req.user) profileHasInterest(req.query.userID, req.query.courseID)
    .then(doc => res.json({ userID: doc.userID, 
        fullName: doc.fullName, 
        about: doc.about, 
        interests: doc.interests,
        display_pic: doc.display_pic, 
    })).catch(e => {
        res.status(404).json({ message: 'Not found.', e });
    });
});

app.get('/getInterestsOfProfile', jwt.ensureLoggedIn, async (req, res) => {
    if (req.user) getInterestsOfProfile(req.query.userID)
    .then(interests => res.json(interests))
    .catch(e => {
        res.status(404).json({ message: 'Not found.', e });
    });
});

app.get('/getProfilesWithInterest', jwt.ensureLoggedIn, async (req, res) => {
    if (req.user) getProfilesWithInterest(req.query.courseID, parseInt(req.query.offset))
    .then(docs => {
        let profiles = docs.map(doc => ({ userID: doc.userID, 
            fullName: doc.fullName, 
            about: doc.about, 
            interests: doc.interests,
            display_pic: doc.display_pic, 
        }));
        res.json(profiles);
    }).catch(e => {
        res.status(404).json({ message: 'Not found.', e });
    });
});

const isAdminUser = async (user) => {
    var admin = await auth.get('/userHasRole', {
        params: { user, role: 'admin' },
        headers: { authorization: token },
    })
    .then(res => res.data)
    .catch(e => undefined);
    return typeof admin !== 'undefined';
}

app.get('/updateProfile', jwt.ensureLoggedIn, async (req, res) => {
    if (req.user?.aud === serviceAudience
        ^ await isAdminUser(req.user?.name)) {
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
        ^ await isAdminUser(req.user?.name)) {
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
    console.warn(new Date(), `Profile listening on port ${ profilePort }`);
});