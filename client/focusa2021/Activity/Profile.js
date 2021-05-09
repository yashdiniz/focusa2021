import React,{useState,useCallback} from 'react';
import {View,Text,StatusBar,Dimensions,Image,RefreshControl} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import styles from '../Styles/ProfileStyles';
import ErrorLogin from '../Components/ErrorLogin';
import {ensureAuthenticated} from '../interface/ensureAuthenticated';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Profile = ({ navigation, token }) =>{
    ensureAuthenticated(navigation, token);

    // let { data, error, loading } = useQuery(getProfileFromUser, {
    //         // TODO
    // });

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);


const ProfileView=()=>{
         return token ? 
         ( <View style={styles.container}>
            <StatusBar backgroundColor = "#ffffff" barStyle="dark-content"/>
        
            <TouchableOpacity style={{paddingRight: 25, width: Dimensions.get('screen').width, alignItems:'flex-end'}} onPress={()=>navigation.navigate('Settings')}>
                    <MaterialCommunityIcons name="cog" size={35} style={{marginTop: 10,}} />
            </TouchableOpacity>
        
            <View style={{alignItems:'center',justifyContent:'center',width:Dimensions.get('screen').width, height:Dimensions.get('screen').height-100}}>
                <MaterialCommunityIcons name="account" size={80} style={styles.UserIcon} />
                <Text style={styles.nameText}>Alston Dias</Text>
                <Text style={styles.usernameText}>@alstar_1402</Text>
                <Text style={styles.aboutText}>About: Don Bosco College of Engineering</Text>
                <View style={{ borderColor: 'black',borderBottomWidth: 1, marginTop: 200, width:Dimensions.get('screen').width}}/>
        
                <View>
                    <TouchableOpacity style={{flexDirection:'row'}}>
                        <Text style={{fontSize:20, marginTop:20}}>Courses Following</Text>
                        <MaterialCommunityIcons name="greater-than" size={35} style={{marginTop: 19,}} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>) :
        (<ErrorLogin navigation={navigation}/>);
}
    return(
        <View refreshControl={
            <RefreshControl 
            refreshing={refreshing}
            onRefresh={onRefresh}/>
        }>
          {ProfileView()}
        </View>
       
    )
}

export default Profile;