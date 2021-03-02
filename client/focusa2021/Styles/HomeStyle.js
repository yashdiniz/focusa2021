import React from 'react';
import {StyleSheet, Dimensions, OpaqueColorValue} from 'react-native';

export default StyleSheet.create({
    Homeview:{
        alignItems: "center",
        justifyContent: "center"

    },
    PostView:{
        width: Dimensions.get('screen').width,
        height: 250,
        borderColor: 'grey',
        borderWidth: 2,
        margin: 12
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
    }
})