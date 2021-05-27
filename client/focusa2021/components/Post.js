import React from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Moment from 'moment';

function Post({ parent, author, course, time, text, attachmentURL }) {
    // TODO: make provisions for parent and comments!

    // Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
    const date = new Date(time);
    console.log('Date in Post', date.toUTCString(), date.toISOString());
    console.log(`Custom Date string: ${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`)
    
    
    const formatTime = (time) => {
        const t = new Date(parseFloat(time));
        return t;
    }

    Moment.locale('en');

    return (
        // <Card>
        //     <Text>
        //         {JSON.stringify(props)}
        //     </Text>
        // </Card>

        <View style={styles.PostView}>
            <Text style={{
                fontStyle: 'italic',
                color: 'lightgray'
            }}>
                {parent ? 'Comment' : ''}
            </Text>
            <Text style={styles.subjectName}>{course}</Text>

            <View style={{flexDirection: "row"}}>
            <Text style={styles.userName}>{author}</Text>
            <Text>  |  </Text>
             <Text style={styles.time}>{Moment(time).format('d MMM')}</Text>
            </View>

            <View style={{ borderBottomColor: 'grey',borderBottomWidth: 1, marginTop: 10}}/>
            <Text style={styles.topictitle}>{text}</Text>

            <View style={{alignItems:'center', justifyContent:'center'}}>
                {/* https://stackoverflow.com/a/30540502/13227113 */}
                    <TouchableOpacity style={{flexDirection:'row'}} onPress={attachmentURL.length>0 ? Linking.openURL(attachmentURL) : null}>
                        <MaterialCommunityIcons name="file-document" size={30} style={{marginTop: 20, paddingLeft: 27}} />
                        <Text style={{marginTop:28}}>View Attachments</Text>
                    </TouchableOpacity>
            </View>

            <View style={{ borderBottomColor: 'grey',borderBottomWidth: 1, marginTop: 15}}/>

            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity >
                        <MaterialCommunityIcons name="comment-processing-outline" size={35} style={{marginTop: 10, paddingLeft: 27}} />
                </TouchableOpacity>

                <TouchableOpacity>
                <MaterialCommunityIcons name="share-outline" size={35} style={{marginTop: 10, paddingLeft: 27}} />
                </TouchableOpacity>


                <TouchableOpacity style={{marginLeft:'auto', paddingRight: 15}}>
                <MaterialCommunityIcons name="download" size={35} style={{marginTop: 10, paddingLeft: 27}} />
                </TouchableOpacity>
            </View>
           
        </View>
    );
}
const styles = StyleSheet.create({
    PostView:{
        width: Dimensions.get('screen').width - 20,
        height: 250,
        borderColor: 'grey',
        borderWidth: 2,
        margin: 10,
        backgroundColor:'#ffffff'  
    },
    subjectName:{
        padding: 10,
        fontSize: 18, 
    },
    userName:{
        paddingLeft: 20,
    },
    time:{
        color: 'grey',
        textAlign: 'left',
    },
    topictitle:{
        marginTop: 10,
        paddingLeft: 10,
        fontSize: 20,
    },
})
export default Post;