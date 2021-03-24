import React from 'react';
import { ApolloProvider, useQuery, gql } from '@apollo/client';
import { Picker } from '@react-native-picker/picker';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';

import BottomNavigator from './Components/BottomNavigator';

const App = (props) => {
    return(
        <NavigationContainer>
            <BottomNavigator/>
        </NavigationContainer>
    );
}

export default App;