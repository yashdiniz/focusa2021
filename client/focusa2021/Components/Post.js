import React from 'react';
import { View, Text, TouchableOpacity, } from 'react-native';
import styles from '../Styles/HomeStyle';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Posts = () =>{
    return(
        <View style={styles.PostView}>
            <Text style={styles.subjectName}>Big Data Analysis</Text>

            <View style={{flexDirection: "row"}}>
            <Text style={styles.userName}>Robin.Sharma</Text>
            <Text>  |  </Text>
             <Text style={styles.time}>7:00pm</Text>
            </View>

            <View style={{ borderBottomColor: 'grey',borderBottomWidth: 1, marginTop: 10}}/>
            <Text style={styles.topictitle}>Regression Analysis</Text>

            <View style={{alignItems:'center', justifyContent:'center'}}>
                    <TouchableOpacity style={{flexDirection:'row'}}>
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
                <MaterialCommunityIcons name="dots-horizontal" size={35} style={{marginTop: 10, paddingLeft: 27}} />
                </TouchableOpacity>
            </View>
           
        </View>
    );
}

export default Posts