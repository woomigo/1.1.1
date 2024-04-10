import React, { useState } from 'react';
import { Icon } from "@rneui/themed";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebaseConfig';

import RegisterScreen from './components/RegisterScreen';
import RegisterFullnameScreen from './components/RegisterFullnameScreen';
import RegisterDOBScreen from './components/RegisterDOBScreens';
import RegisterUsernameScreen from './components/RegisterUsername';
import RegisterProfilePictureScreen from './components/RegisterProfilePicture';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import ProfileScreen from './components/ProfileScreen';
import CameraScreen from './components/CameraScreen';
import MigosScreen from './components/MigosScreen';
import MigoRequestScreen from './components/MigoRequestsScreen';
import MenuScreen from './components/MenuScreen'
import SearchScreen from './components/SearchScreen'
import MessagesScreen from './components/MessagesScreen'
import ComposeMessageScreen from './components/ComposeMessageScreen';
import NotificationsScreen from './components/NotificationsScreen';
import WooDateScreen from './components/WooDateScreen';
import WooTimeScreen from './components/WooTimeScreen';
import WooLocationScreen from './components/WooLocationScreen';
import WooMigosScreen from './components/WooMigosScreen';
import WooListScreen from './components/WooListScreen';
import WooPreviewEditScreen from './components/WooPreviewEditScreen';
import { woo_orange, woo_gray } from './assets/colors';



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();



const HomeStack = () => {
  return (
    <Stack.Navigator options={{ headerShown: false }} >
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false, }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      
    </Stack.Navigator>
  )
}

const NotificationsStack = () => {
  return (
    <Stack.Navigator options={{ headerShown: false }} >
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

const ProfileStack = () => {
  return (
    <Stack.Navigator options={{ headerShown: false }} >
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Migos" component={MigosScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MigoRequests" component={MigoRequestScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Menu" component={MenuScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

const CameraStack = () => {
  return (
    <Stack.Navigator options={{ headerShown: false }} >
      <Stack.Screen name="Camera" component={CameraScreen} options={{ headerShown: false }} />
      <Stack.Screen name="WooDate" component={WooDateScreen} options={{ headerShown: false }} />
      <Stack.Screen name="WooTime" component={WooTimeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="WooLocation" component={WooLocationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="WooMigos" component={WooMigosScreen} options={{ headerShown: false }} />
      <Stack.Screen name="WooList" component={WooListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="WooPreviewEdit" component={WooPreviewEditScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

const SearchStack = () => {
  return (
    <Stack.Navigator options={{ headerShown: false }} >
      <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

const MessagesStack = () => {
  return (
    <Stack.Navigator options={{ headerShown: false }} >
      <Stack.Screen name="Messages" component={MessagesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ComposeMessage" component={ComposeMessageScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}


const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [uid, setUID] = useState(null);
  const [messagesNotificationCount, setMessagesNotificationCount] = useState()
  const [notificationCount, setNotificationCount] = useState(0)

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
    <NavigationContainer >
      <Tab.Navigator screenOptions={{ tabBarShowLabel: false, tabBarActiveTintColor: woo_orange, tabBarInactiveTintColor: woo_gray, headerShown: false }}>
        <Tab.Screen
          name="HomeTab"
          component={HomeStack}
          options={{
            title: "home",
            tabBarIcon: ({ color }) => (
              <Icon
                name="home"
                type='font-awesome-5'
                color={color}
                size={25}
              />)
          }} />

        {/* <Tab.Screen
          name="MenuTab"
          component={MenuStack}
          options={{
            title: "menu",
            tabBarIcon: ({ color }) => (
              <Icon
                name="bars"
                type='font-awesome-5'
                color={color}
                size={25}
              />)
          }} /> */}
        <Tab.Screen
          name="ProfileTab"
          component={ProfileStack}
          options={{
            title: "profile",
            tabBarIcon: ({ color }) => (<Icon
              name="user"
              solid
              type='font-awesome-5'
              color={color}
              size={25}
            />),
          }} />
        <Tab.Screen
          name="CameraTab"
          component={CameraStack}
          options={{
            title: "camera",
            tabBarIcon: ({ color }) => (<Icon
              name="camera"
              type='font-awesome-5'
              color={color}
              size={25}
            />)
          }} />
        <Tab.Screen
          name="SearchTab"
          component={SearchStack}
          options={{
            title: "search",
            tabBarIcon: ({ color }) => (
              <Icon
                name="search"
                type='font-awesome-5'
                color={color}
                size={25}
              />)
          }} />
        <Tab.Screen
          name="MessagesTab"
          component={MessagesStack}
          options={{
            title: "messages",
            tabBarBadge: messagesNotificationCount > 0 ? messagesNotificationCount : undefined,
            tabBarIcon: ({ color }) => (
              <Icon
                name="envelope"
                solid
                type='font-awesome-5'
                color={color}
                size={25}
              />),
          }} />
        <Tab.Screen
          name="NotificationsTab"
          component={NotificationsStack}
          options={{
            title: "notifications",
            tabBarBadge: notificationCount > 0 ? notificationCount : undefined,
            tabBarIcon: ({ color }) => (
              <Icon
                name="bell"
                solid
                type='font-awesome-5'
                color={color}
                size={25}
              />)
          }} />
      </Tab.Navigator>
    </NavigationContainer>
    // <NavigationContainer>
    //   <Stack.Navigator options={{ headerShown: false }}>
    //     {isSignedIn ? (
    //       <>
    //         <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false, }} initialParams={{ 'uid': uid }} />
    //         <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} initialParams={{ 'uid': uid }} />
    //         
    //         <Stack.Screen name="MigoRequests" component={MigoRequestScreen} options={{ headerShown: false }} initialParams={{ 'uid': uid }} />

    //         <Stack.Screen name="ComposeMessage" component={ComposeMessageScreen} options={{ headerShown: false }} initialParams={{ 'uid': uid }} />
    //         <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }} initialParams={{ 'uid': uid }} />
    //         <Stack.Screen name="WooDate" component={WooDateScreen} options={{ headerShown: false }} initialParams={{ 'uid': uid }} />
    //         <Stack.Screen name="WooTime" component={WooTimeScreen} options={{ headerShown: false }} initialParams={{ 'uid': uid }} />
    //         <Stack.Screen name="WooLocation" component={WooLocationScreen} options={{ headerShown: false }} initialParams={{ 'uid': uid }} />
    //         <Stack.Screen name="WooMigos" component={WooMigosScreen} options={{ headerShown: false }} initialParams={{ 'uid': uid }} />
    //         <Stack.Screen name="WooList" component={WooListScreen} options={{ headerShown: false }} initialParams={{ 'uid': uid }} />
    //         <Stack.Screen name="WooPreviewEdit" component={WooPreviewEditScreen} options={{ headerShown: false }} initialParams={{ 'uid': uid }} />




    //       </>
    //     ) : (
    //       <>
    //         <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false, gestureEnabled: false }} />
    //         <Stack.Screen name="RegisterFullname" component={RegisterFullnameScreen} options={{ headerShown: false, gestureEnabled: false }} />
    //         <Stack.Screen name="RegisterDOB" component={RegisterDOBScreen} options={{ headerShown: false, gestureEnabled: false }} />
    //         <Stack.Screen name="RegisterUsername" component={RegisterUsernameScreen} options={{ headerShown: false, gestureEnabled: false }} />
    //         <Stack.Screen name="RegisterProfilePicture" component={RegisterProfilePictureScreen} options={{ headerShown: false, gestureEnabled: false }} />
    //         <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false, gestureEnabled: false }} />
    //       </>
    //     )}
    //   </Stack.Navigator>
    // </NavigationContainer>
  );
}

export default App;