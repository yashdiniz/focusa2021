import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../Styles/SubjectPageStyle';

const SubjectPageHeader = () =>{
    return(
        <View style={styles.SubjectPageHeaderView}>
            <Text style={styles.SubjectTitle}>Big Data Analytics</Text>

            <View style={{paddingRight: 20}}>
            <Text style={styles.SubjectDescription}>Comp 7.4.5</Text>

                <TouchableOpacity style={{
                    backgroundColor:'white', 
                    width: 100, alignItems: 'center',
                    height: 30, 
                    justifyContent:'center',
                    borderColor: 'black',
                    borderWidth: 1,
                    marginLeft: 'auto',
                    borderRadius: 10}}>
                        <Text>Suscribe</Text>
                </TouchableOpacity>
            </View>

            

        </View>
    );
}

export default SubjectPageHeader;