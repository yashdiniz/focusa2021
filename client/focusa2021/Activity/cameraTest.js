// import React, { useEffect, useState, useRef } from 'react';
// import { RTCView, mediaDevices, RTCPeerConnection } from 'react-native-webrtc';
// import io from 'socket.io-client';
// import Peer from 'simple-peer';
// import {View, Text, TouchableOpacity} from 'react-native';
// import styles from '../Styles/CameraTestStyles';

// const socket = io.connect("http://192.168.44.72:5000");

// const CameraTest = ({ navigation, route, token }) => {
//     const [stream, setStream]= useState();
//     const [myStream, setMyStream] = useState();
//     const [ID, setID] = useState();
//     const [receiver, setReceiver] = useState();
//     const [name, setName] = useState();
//     const [signal, setCallerSignal] = useState();
//     const [callAccepted, setCallAccepted] = useState();
//     const [callEnded, setCallEnded] = useState();
//     const connectionRef = useRef();

//     const configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};

//     let isFront = true;
//     useEffect(() => {
//         mediaDevices.getUserMedia({
//             audio: true,
//             video: {
//                 width: 640,
//                 height: 480,
//                 frameRate: 30,
//                 facingMode: (isFront ? "user" : "environment"),
//                 deviceId: undefined
//             }
//         })
//         .then(() => mediaDevices.enumerateDevices())
//         .then(sourceInfos => {
//             console.log('Enumerate devices:', sourceInfos);
//             let videoSourceId;
//             for (let i = 0; i < sourceInfos.length; i++) {
//             const sourceInfo = sourceInfos[i];
//                 if(sourceInfo.kind == "videoinput" && sourceInfo.facing == (isFront ? "front" : "environment")) {
//                     videoSourceId = sourceInfo.deviceId;
//                 }
//             }

//             socket.on('me', id => setID(id));
//             socket.on('callUser', data => {
//                 setReceiver(true);
//                 setCaller(data.from);
//                 setName(data.name);
//                 setCallerSignal(data.signal);
//             });

//             return mediaDevices.getUserMedia({
//                 audio: true,
//                 video: {
//                     width: 640,
//                     height: 480,
//                     frameRate: 30,
//                     facingMode: (isFront ? "user" : "environment"),
//                     deviceId: videoSourceId
//                 }
//             })
//             .then(setMyStream)
//             .catch(console.error);
//         }).catch(console.error);      
//     });

//     const callUser = (id) => () => {
//         const pc = new RTCPeerConnection(configuration);
//         // const peer = new Peer({
//         //     initiator: true,
//         //     wrtc: WebRTC
//         // });

//         pc.createOffer().then(desc => {
//             pc.setLocalDescription(desc).then(() => {
//                 // Send pc.localDescription to peer
//                 console.log(pc.localDescription)
//             });
//         });
        
//         pc.onicecandidate = function (event) {
//             // send event.candidate to peer
//             console.log(event)
//         };

//         peer.on('signal', data => {
//             socket.emit('callUser', {
//                 userToCall: id,
//                 signalData: data,
//                 from: me,
//                 name,
//             });
//         });

//         pc.onaddstream(stream => {
//             setStream(stream);
//         });
        
//         // peer.on('stream', stream => {
//         //     setStream(stream);
//         // });
        
//         socket.on('callAccepted', signal => {
//             setCallAccepted(true);
//             peer.signal(signal);
//         });
//         connectionRef.current = pc;
//         return 0;
//     }

//     const answerCall = () => {
//         setCallAccepted(true)
//         const peer = new Peer({
//             initiator: false,
//             trickle: false,
//             stream: stream,
//         })

//         peer.on("signal", (data)=>{
//             socket.emit("answerCall", {signal: data, to:caller})
//         })

//         peer.on("stream", (stream)=>{
//             setStream(stream);
//         })

//         peer.signal(callerSignal)
//         connectionRef.current = peer

//         return 0;
//     }

//     const leaveCall = () =>{
//         setCallEnded(true)
//         connectionRef.current.destroy()
//     }

//     return (
//         <View>
//             { stream && <RTCView streamURL={myStream.toURL()}/>}
//             { callAccepted && !callEnded ? 
//             <RTCView streamURL={stream.toURL()}/>:
//             null
//             }
            
//             <TouchableOpacity style={styles.MakeCall} onPress={callUser()}>
//                 <Text>Call</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.MakeCall} onPress={answerCall}>
//                 <Text>Answer Call</Text>
//             </TouchableOpacity>
//         </View>
//     );
// }

// export default CameraTest;