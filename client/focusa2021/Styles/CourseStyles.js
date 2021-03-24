import {StyleSheet,Dimensions} from 'react-native';

export default StyleSheet.create({
    CoursesView:{
        alignItems:'center',
        justifyContent:'center', 
        backgroundColor:'#eeeeee'
    },
    singleCourseView:{
        borderColor: 'grey',
        borderWidth: 1,
        width: Dimensions.get('screen').width -15,
        height: 130,
        marginTop: 10,
        backgroundColor: '#ffffff',
        borderRadius: 16,

    },
    SubjectTitle:{
        marginTop: 10,
        paddingLeft: 10,
        fontSize: 18,
        fontWeight: 'bold',
    },
    SubjectDescription:{
        paddingLeft: 20,
        marginTop: 10,
        color: 'grey'
    }
})