import {StyleSheet, Dimensions} from 'react-native'

export default StyleSheet.create({
    SujectPageView:{
        alignContent:'center',
        justifyContent: 'center',
    },
    SubjectPageHeaderView:{
        width: Dimensions.get('screen').width,
        height: 150,
        backgroundColor: '#cccccc',
    },
    SubjectTitle:{
        marginTop: 10,
        marginLeft: 10,
        fontSize: 30
    },
    SubjectDescription:{
        marginTop: 10,
        marginLeft: 20,
        fontSize: 15
    }
})