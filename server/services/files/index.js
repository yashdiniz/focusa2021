// Reference for multer https://www.npmjs.com/package/multer
const express = require('express');
const fs = require('fs');
const app = express();
const { filesPath, filesPort, serviceAudience } = require('../../config');
const jwt = require('../jwt');
const multer = require('multer');

// Reference: https://github.com/ipfs/js-ipfs
const ipfs = require('ipfs-http-client').create({

});

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
            cb(null, `${Date.now()}-${file.originalname}`);
        }
    })
});

// static serve files from here, not needed since /ipfs takes care of it...
// app.use('/file', express.static(filesPath));

app.get('/ipfs/:cid/:name', /*jwt.ensureLoggedIn,*/ async (req, res) => {
    // Content ID (CID) and filename are required!
    if(req.params.name && req.params.cid) {
        const hash = req.params.cid;
        const stream = ipfs.cat(hash);
        const stat = await ipfs.files.stat(`/ipfs/${hash}`);

        let drain = new Promise(  // promise used to wait 
            (resolve) => res.on('drain', resolve)
        );
        
        // essentially pipe between HTTP and IPFS
        // Reference: https://stackoverflow.com/questions/44896984/what-is-the-best-way-to-download-a-big-file-in-nodejs
        res.writeHead(200, { "Content-Length": stat.size });
        do { // do until entire file contents transferred
            let chunk = await stream.next();    // wait for next chunk from IPFS
            if (chunk.value)
                if (!res.write(chunk.value, // write the chunk to HTTP stream
                    err => err ? console.error(new Date(), 'File stream error', err) : ''
                ))
                    await drain;    // if failed to write chunk, wait for res to drain

            if(chunk.done) break;   // quit loop when stream ends
        } while(true);
        res.end();  // end the stream after the file is done transferring

    } else res.status(404).json({ message: 'Bad User Input.' });
});

app.get('/pin', jwt.ensureLoggedIn, async (req, res) => {
    if (req.user?.aud === serviceAudience) { // only if microservice
        if (req.query.cid) {
            const hash = req.query.cid;
            const body = await ipfs.pin.add(hash);
            res.json({
                body
            });
        } else res.status(404).json({ message: 'Bad User input.' });
    } else res.status(404).json({ message: 'not authorized.' });
});

app.get('/unpin', jwt.ensureLoggedIn, async (req, res) => {
    if (req.user?.aud === serviceAudience) { // only if microservice
        if (req.query.cid) {
            const hash = req.query.cid;
            const body = await ipfs.pin.rm(hash);
            res.json({
                body
            });
        } else res.status(404).json({ message: 'Bad User input.' });
    } else res.status(404).json({ message: 'not authorized.' });
});

// TODO: Fix all issues!
// Support file deletion, Put upload limits!
app.post('/upload', jwt.ensureLoggedIn, upload.single('attachment'), async (req, res) => {
    console.log(new Date(), 'Files service upload:', req.file, /*req.body*/);
    
    if (req.user && req.file) {
        const stream = fs.createReadStream(req.file.path);
        const content = await ipfs.add(stream); // also make sure to add the file
        fs.unlink(req.file.path, e => e);
        res.json({
            path: content.path,
            name: req.file.filename,
        });
    }
    else res.status(404).json({ message: 'Bad User Input.' });
});

app.listen(filesPort, () => {
    console.warn(new Date(), `Files listening on port ${filesPort}`);
});
