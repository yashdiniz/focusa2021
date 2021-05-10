import {StyleSheet, Dimensions} from 'react-native';

export default StyleSheet.create({
    container:{
        backgroundColor: 'white',
        alignItems: "center",
        justifyContent: "center",
        height: Dimensions.get('screen').height,
        width: Dimensions.get('screen').width,
    },

    image:{
        marginTop: 10,
        width: 60,
        height: 200,
    },
    focusaText:{
        marginTop: 20,
        width: 170,
        height: 32,
    },

    inputBox:{
        height: 40,
        width: 250,
        borderColor: 'gray',
        borderWidth: 2,
        marginTop: 30,
        padding: 10,
        borderRadius: 17,
    },

    PasswordInputBox:{
        flexDirection: 'row',
        height: 40,
        width: 250,
        borderColor:'gray',
        borderWidth: 2,
        marginTop: 30,
        padding: 10,
        borderRadius: 17
    },

    forgotpassword:{
        marginTop: 10,
    },

    forgotPasswordOverlayStyle:{
        alignItems: 'center',
        height: Dimensions.get('screen').height - 530,
        width: Dimensions.get('screen').width - 70,
        borderColor: 'black',
        borderWidth: 1,
    },

    submitButton:{
        marginTop:20,
        alignItems: "center",
        justifyContent:"center",
        borderWidth:1,
        borderColor:"black",
        backgroundColor:"black",
        width: 90,
        height:30,
        borderRadius: 15,
    },
})
