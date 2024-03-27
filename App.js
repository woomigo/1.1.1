import React, {useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebaseConfig';

import RegisterScreen from './screens/RegisterScreen';
import RegisterFullnameScreen from './screens/RegisterFullnameScreen';
import RegisterDOBScreen from './screens/RegisterDOBScreens';
import RegisterUsernameScreen from './screens/RegisterUsername';
import RegisterProfilePictureScreen from './screens/RegisterProfilePicture';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import CameraScreen from './screens/CameraScreen';
import MigosScreen from './screens/MigosScreen';
import MenuScreen from './screens/MenuScreen'
import SearchScreen from './screens/SearchScreen'
import MessagesScreen from './screens/MessagesScreen'
import NotificationsScreen from './screens/NotificationsScreen';
import WooDateScreen from './screens/WooDateScreen';
import WooTimeScreen from './screens/WooTimeScreen';
import WooLocationScreen from './screens/WooLocationScreen';
import WooMigosScreen from './screens/WooMigosScreen';
import WooListScreen from './screens/WooListScreen';
import WooPreviewEditScreen from './screens/WooPreviewEditScreen';

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
            <Stack.Screen name="Camera" component={CameraScreen} options={{ headerShown: false }} initialParams={{ 'uid': uid }} />
            <Stack.Screen name="Menu" component={MenuScreen} options={{ headerShown: false }} initialParams={{ 'uid': uid }} />
            <Stack.Screen name="Migos" component={MigosScreen} options={{ headerShown: false }} initialParams={{ 'uid': uid }} />
            <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} initialParams={{ 'uid': uid }} />
            <Stack.Screen name="Messages" component={MessagesScreen} options={{ headerShown: false }} initialParams={{ 'uid': uid }} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }} initialParams={{ 'uid': uid }} />
            <Stack.Screen name="WooDate" component={WooDateScreen} options={{ headerShown: false }} initialParams={{ 'uid': uid }} />
            <Stack.Screen name="WooTime" component={WooTimeScreen} options={{ headerShown: false }} initialParams={{ 'uid': uid }} />
            <Stack.Screen name="WooLocation" component={WooLocationScreen} options={{ headerShown: false }} initialParams={{ 'uid': uid }} />
            <Stack.Screen name="WooMigos" component={WooMigosScreen} options={{ headerShown: false }} initialParams={{ 'uid': uid }} />
            <Stack.Screen name="WooList" component={WooListScreen} options={{ headerShown: false }} initialParams={{ 'uid': uid }} />
            <Stack.Screen name="WooPreviewEdit" component={WooPreviewEditScreen} options={{ headerShown: false }} initialParams={{ 'uid': uid }} />
            
   


          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="RegisterFullname" component={RegisterFullnameScreen} options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="RegisterDOB" component={RegisterDOBScreen} options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="RegisterUsername" component={RegisterUsernameScreen} options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="RegisterProfilePicture" component={RegisterProfilePictureScreen} options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false, gestureEnabled: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;