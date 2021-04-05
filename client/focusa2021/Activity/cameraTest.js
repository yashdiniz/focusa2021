import React, { useEffect, useState, useRef } from 'react';
import { mediaDevices } from 'react-native-webrtc';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import Video from 'react-native-video';
import { checkDocument } from '@apollo/client/utilities';
import {Text, TouchableOpacity} from 'react-native';
import styles from '../Styles/CameraTestStyles';

  const socket = io.connect("http://192.168.43.71:5000");

  const CameraTest = () => {
    const [stream, setStream]= useState();
    const [ID, setID] = useState();
    const [receiver, setReceiver] = useState();
    const [name, setName] = useState();
    const [signal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState();
    const [callEnded, setCallEnded] = useState();
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();
    const configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
//   const pc = new RTCPeerConnection(configuration);


let isFront = true;
useEffect(() => {
    mediaDevices.enumerateDevices().then(sourceInfos => {
        console.log(sourceInfos);
        let videoSourceId;
        for (let i = 0; i < sourceInfos.length; i++) {
          const sourceInfo = sourceInfos[i];
          if(sourceInfo.kind == "videoinput" && sourceInfo.facing == (isFront ? "front" : "environment")) {
            videoSourceId = sourceInfo.deviceId;
          }
        }
        mediaDevices.getUserMedia({
          audio: true,
          video: {
            width: 640,
            height: 480,
            frameRate: 30,
            facingMode: (isFront ? "user" : "environment"),
            deviceId: videoSourceId
          }
        })
        .then(stream => {
          setStream(stream);
          myVideo.current.srcObject = stream;
        })
        .catch(console.error);
        socket.on('me', id => setID(id));
        socket.on('callUser', data => {
            setReceiver(true);
            setCaller(data.from);
            setName(data.name);
            setCallerSignal(data.signal);
        });
      });      
}, []);

const callUser = (id) => {
    const peer = new Peer({
        initiator: true,
        trickle: false,
        stream,
    });
    peer.on('signal', data => {
        socket.emit('callUser', {
            userToCall: id,
            signalData: data,
            from: me,
            name,
        });
    });
    peer.on('stream', stream => {
        userVideo.current.srcObject = stream;
    });
    socket.on('callAccepted', signal => {
        setCallAccepted(true);
        peer.signal(signal);
    });
    connectionRef.current = peer;
    return 0;
}

const answerCall = () => {
    setCallAccepted(true)
    const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: stream,
    })

    peer.on("signal", (data)=>{
        socket.emit("answerCall", {signal: data, to:caller})
    })

    peer.on("stream", (stream)=>{
        userVideo.current.srcObject = stream
    })

    peer.signal(callerSignal)
    connectionRef.current = peer

    return 0;
}

const leaveCall = () =>{
    setCallEnded(true)
    connectionRef.current.destroy()
}

return (
    <View>
        { stream && <Video muted ref={myVideo} autoPlay style={{width:'300px'}}/>}
        { callAccepted && !callEnded ? 
        <Video muted ref={userVideo} autoPlay style={{width:'300px'}}/>:
        null
        }
        
        <TouchableOpacity style={styles.MakeCall} onPress={callUser(ID)}>
            <Text>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.MakeCall} onPress={answerCall()}>
            <Text>Answer Call</Text>
        </TouchableOpacity>
    </View>
);

}

export default CameraTest;