import {StyleSheet, Dimensions} from 'react-native';

export default StyleSheet.create({

    container1:{
        alignItems:'center',
        justifyContent:'center',
         backgroundColor:'white',
         height: Dimensions.get('screen').height,
        width: Dimensions.get('screen').width,
    },
    LoginOutButton:{
        backgroundColor: 'black',
        width: Dimensions.get('screen').width-40,
        height: 35,
        marginBottom:'auto',
        alignItems:'center',
        justifyContent:'center',
        borderWidth: 2,
        borderRadius: 20,
        marginTop: 30
    },
    image:{
        marginTop: -80,
        width: 60,
        height: 200,
    },
    focusaText:{
        marginTop: 20,
        width: 170,
        height: 32,
    },
})