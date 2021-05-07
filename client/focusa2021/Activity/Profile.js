import React from 'react';
import {View,Text,StatusBar,Dimensions,Image} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import styles from '../Styles/ProfileStyles';
import ErrorLogin from '../Components/ErrorLogin';
import {ensureAuthenticated} from '../interface/ensureAuthenticated';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Profile = ({ navigation, token }) =>{
    ensureAuthenticated(navigation, token);


const ProfileView=()=>{

    if(!token){
         return <ErrorLogin navigation={navigation}/>
    }
    else{
        return ( <View style={styles.container}>
        <StatusBar backgroundColor = "#ffffff" barStyle="dark-content"/>
    
        <TouchableOpacity style={{paddingRight: 25, width: Dimensions.get('screen').width, alignItems:'flex-end'}} onPress={()=>navigation.navigate('Setting')}>
                <MaterialCommunityIcons name="cog" size={35} style={{marginTop: 10,}} />
        </TouchableOpacity>
    
        <View style={{alignItems:'center',justifyContent:'center',width:Dimensions.get('screen').width, height:Dimensions.get('screen').height-100}}>
            <MaterialCommunityIcons name="account" size={80} style={styles.UserIcon} />
            <Text style={styles.nameText}>Alston Dias</Text>
            <Text style={styles.usernameText}>@alstar_1402</Text>
            <Text style={styles.classText}>B.E Computer</Text>
            <Text style={styles.collegeNameText}>Don Bosco College of Engineering</Text>
            <View style={{ borderColor: 'black',borderBottomWidth: 1, marginTop: 200, width:Dimensions.get('screen').width}}/>
    
            <View>
                <TouchableOpacity style={{flexDirection:'row'}}>
                    <Text style={{fontSize:20, marginTop:20}}>Courses Following</Text>
                    <MaterialCommunityIcons name="greater-than" size={35} style={{marginTop: 19,}} />
                </TouchableOpacity>
            </View>
        </View>
    </View>)
    }

}

    return(
        ProfileView()
    )
}

export default Profile