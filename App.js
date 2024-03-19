import React, {useState} from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebaseConfig';

import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [uid,setUID] = useState(null);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setIsSignedIn(true);
      setUID(user.uid);
      // ...
    } else {
      // User is signed out
      setIsSignedIn(false)

    }
  });

  return (
    // <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
    //   <Text>WORKING?</Text>
    // </View>
    <NavigationContainer>
      <Stack.Navigator options={{ headerShown: false }}>
        {isSignedIn ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false, }} initialParams={{ 'uid': uid }} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} initialParams={{ 'uid': uid }} />


          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false, gestureEnabled: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;