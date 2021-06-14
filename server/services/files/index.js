// Reference for resumable download: https://stackoverflow.com/q/44896984/13227113
// Reference for multer https://www.npmjs.com/package/multer

const express = require('express');
const app = express();
const { filesPath, filesPort } = require('../../config');
const jwt = require('../jwt');
const multer = require('multer');

// TODO: Obvious risk of possible DoS, among other hacks.
// allowing file uploads of any type to the server, with
// complete trust of client. No file format/size limits either.
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, filesPath);
        },
        filename: (req, file, cb) => {
            // TODO: try using md5 hash for better file mgmt
            cb(null, `${Date.now()}-${file.filename}`);
        }
    })
});

// static serve files from here...
app.use('/file', express.static(filesPath));

// TODO: Fix all issues!
// Support file deletion, 
// Put upload limits, and most importantly, keep authentication checks!
app.patch('/upload', jwt.ensureLoggedIn, upload.single('attachment'), (req, res) => {
    console.log(new Date(), 'Files service:', req.file, /*req.body*/);
    if (req.user && req.file) {
        res.json({
            name: req.file.filename,
        });
    }
    else res.status(404).json({ message: 'Bad User Input.' });
});

app.listen(filesPort, () => {
    console.warn(new Date(), `Files listening on port ${filesPort}`);
});


// // Reference: https://github.com/ipfs/js-ipfs
// // Could create our own IPFS node with default config.
// const IPFS = require('ipfs-core');
// const ipfs = IPFS.create({
//     Datastore: {
//         GCPeriod: "1h",
//         StorageMax: "256MB",
//     }
// });