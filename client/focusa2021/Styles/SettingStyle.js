import {StyleSheet, Dimensions} from 'react-native';

export default StyleSheet.create({
    container:{
        width: Dimensions.get('window').width ,
        height: Dimensions.get('window').height,
        backgroundColor: 'white',
    },

    LoginOutButton:{
        backgroundColor: 'black',
        width: Dimensions.get('screen').width,
        height: 25,
        marginBottom:'auto',
        alignItems:'center',
    }
})