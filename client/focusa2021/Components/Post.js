import React, {Components} from 'react';
import { View, Text, TouchableOpacity, Button } from 'react-native';
import styles from '../Styles/HomeStyle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
            <TouchableOpacity 
                style ={{
                    height: 40,
                    width:190,
                    marginTop :20,
                    borderStyle:"solid",
                    borderWidth: 2,
                }}>
             <Button title="View Attachment" color="grey"/> 
          </TouchableOpacity>
            </View>

            <View style={{ borderBottomColor: 'grey',borderBottomWidth: 1, marginTop: 10}}/>
           
        </View>
    );
}

export default Posts