import React from 'react';
import { View, Text, TouchableOpacity, Linking, } from 'react-native';
import styles from '../Styles/HomeStyle';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * 
 * @param {string} time Milliseconds epoch.
 */
const formatTime = (time) => {
    const t = new Date(parseInt(time));
    return t;
}

const Post = ({ data }) =>{
    console.log('In post', data);
    return <View><Text>Test post.</Text></View>
    // return(
    //     <View style={styles.PostView}>
    //         <Text style={styles.subjectName}>{data.course?.name}</Text>

    //         <View style={{flexDirection: "row"}}>
    //         <Text style={styles.userName}>{data.author?.name}</Text>
    //         <Text>  |  </Text>
    //          <Text style={styles.time}>{formatTime(data.time)}</Text>
    //         </View>

    //         <View style={{ borderBottomColor: 'grey',borderBottomWidth: 1, marginTop: 10}}/>
    //         <Text style={styles.topictitle}>{data.text}</Text>

    //         <View style={{alignItems:'center', justifyContent:'center'}}>
    //             {/* https://stackoverflow.com/a/30540502/13227113 */}
    //                 <TouchableOpacity style={{flexDirection:'row'}} onPress={data.attachmentURL?.length>0 ? Linking.openURL(data.attachmentURL) : null}>
    //                     <MaterialCommunityIcons name="file-document" size={30} style={{marginTop: 20, paddingLeft: 27}} />
    //                     <Text style={{marginTop:28}}>View Attachments</Text>
    //                 </TouchableOpacity>
    //         </View>

    //         <View style={{ borderBottomColor: 'grey',borderBottomWidth: 1, marginTop: 15}}/>

    //         <View style={{flexDirection: 'row'}}>
    //             <TouchableOpacity >
    //                     <MaterialCommunityIcons name="comment-processing-outline" size={35} style={{marginTop: 10, paddingLeft: 27}} />
    //             </TouchableOpacity>

    //             <TouchableOpacity>
    //             <MaterialCommunityIcons name="share-outline" size={35} style={{marginTop: 10, paddingLeft: 27}} />
    //             </TouchableOpacity>


    //             <TouchableOpacity style={{marginLeft:'auto', paddingRight: 15}}>
    //             <MaterialCommunityIcons name="dots-horizontal" size={35} style={{marginTop: 10, paddingLeft: 27}} />
    //             </TouchableOpacity>
    //         </View>
           
    //     </View>
    // );
}

export default Post