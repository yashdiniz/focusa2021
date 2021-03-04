import {StyleSheet, Dimensions} from 'react-native';

export default StyleSheet.create({
    Homeview:{
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#eeeeee',
    },
    PostView:{
        width: Dimensions.get('screen').width - 15,
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