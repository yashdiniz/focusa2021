import {StyleSheet, Dimensions} from 'react-native';

export default StyleSheet.create({
    container:{
        alignItems:'center',
        // justifyContent:'center',
         backgroundColor:'white',
         height: Dimensions.get('screen').height,
        width: Dimensions.get('screen').width,
    },

    UserIcon:{
        marginTop: 10,
        padding:12,
        backgroundColor: '#DADADA', 
        width: 100, height:100, 
        borderRadius: 100/2,
    },

    nameText:{
        marginTop: 15,
        fontSize: 30,
        fontWeight: 'bold',
    },

    usernameText:{
        marginTop: 9,
        fontSize: 20,
    },

    classText:{
        marginTop: 90,
        fontSize: 30,
    },


    collegeNameText:{
        fontSize: 15,
    },

})