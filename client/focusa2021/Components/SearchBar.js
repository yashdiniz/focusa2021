import React from 'react';
import {View, TextInput, Dimensions} from 'react-native'

import { MaterialCommunityIcons } from '@expo/vector-icons';

const SearchBar =() =>{
    return(

        <View style={{        
            flexDirection:'row',
            borderWidth: 1, 
            borderColor:'grey',
            width: Dimensions.get('screen').width,
            height: 40,
            borderRadius: 20,
            paddingLeft: 5,
            marginTop: 10}}>
            <MaterialCommunityIcons name="magnify" size={15} style={{paddingTop: 13, paddingLeft:10, color:'grey'}}/>
            <TextInput placeholder="Search" style={{ height: 40,width: Dimensions.get('screen').width}}/>
        </View>

    )
}

export default SearchBar;