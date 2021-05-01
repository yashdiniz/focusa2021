const express = require('express');
const app = express();
const server = https.createServer(app);
const { webrtcPort, realm } = require('../../config');
const io = require('socket.io')(server, {
    cors: {
        // origin: realm + ':' + webrtcPort,
        methods: [ 'GET', 'POST' ]
    }
});

io.on('connection', (socket) => {
    socket.emit('me', socket.id);

    socket.on('disconnect', () => {
        socket.broadcast.emit('callEnded');
    });

    socket.on('callUser', (data) => {
        io.to(data.userToCall).emit('callUser', {
            signal: data.signalData,
            from: data.from,
            name: data.name,
        });
    });

    socket.on('answerCall', (data) => {
        io.to(data.to).emit('callAccepted', data.signal)
    }
    
    );
})

server.listen(webrtcPort, () => {
    console.log(new Date(), 'WebRTC server listening at ' + webrtcPort);
})