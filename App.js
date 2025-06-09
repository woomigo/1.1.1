import "react-native-get-random-values";
import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { LogBox, Text, View } from "react-native";
import { Icon } from "@rneui/themed";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

import RegisterScreen from "./components/RegisterScreen";
import RegisterFullnameScreen from "./components/RegisterFullnameScreen";
import RegisterDOBScreen from "./components/RegisterDOBScreens";
import RegisterUsernameScreen from "./components/RegisterUsername";
import RegisterProfilePictureScreen from "./components/RegisterProfilePicture";
import LoginScreen from "./components/LoginScreen";
import HomeScreen from "./components/HomeScreen";
import ProfileScreen from "./components/ProfileScreen";
import CameraScreen from "./components/CameraScreen";
import MigosScreen from "./components/MigosScreen";
import MigoRequestScreen from "./components/MigoRequestsScreen";
import MenuScreen from "./components/MenuScreen";
import SearchScreen from "./components/SearchScreen";
import MessagesPreviewScreen from "./components/MessagesPreviewScreen";
import NotificationsScreen from "./components/NotificationsScreen";
import WooDateScreen from "./components/WooDateScreen";
import WooTimeScreen from "./components/WooTimeScreen";
import WooLocationScreen from "./components/WooLocationScreen";
import WooMigosScreen from "./components/WooMigosScreen";
import WooListScreen from "./components/WooListScreen";
import WooPreviewEditScreen from "./components/WooPreviewEditScreen";
import { woo_orange, woo_gray } from "./assets/colors";
import WooMigosView from "./components/WooMigosView";
import WooCommentsView from "./components/WooCommentsView";
import WooGalleryView from "./components/WooGalleryView";
import EditMediaScreen from "./components/EditMediaScreen";
import WooListView from "./components/WooListView";
import MediaViewScreen from "./components/MediaViewScreen";
import AddMediaWooGalleryView from "./components/AddMediaWooGalleryView";
import ForgotPasswordScreen from "./components/ForgotPasswordScreen";
import SettingsScreen from "./components/SettingsScreen";
import EditProfileScreen from "./components/EditProfileScreen";
import PrivacyPolicyScreen from "./components/PrivacyPolicyScreen";
import WooScreen from "./components/WooScreen";
import MigoGroupsScreen from "./components/MigoGroupsScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MessageDetailsScreen from "./components/MessagesDetails";
import NewMessageScreen from "./components/NewMessageScreen";
import ManageParticipantsScreen from "./components/ManageParticipantsScreen";
import MoreInfoScreen from "./components/MoreInfoScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
// let user;

const AuthStack = createNativeStackNavigator();
const OnboardingStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();



const App = () => {

  const HomeStack = () => {
    return (
      <Stack.Navigator options={{ headerShown: false }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
        <Stack.Screen
          name="Migos"
          component={MigosScreen}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
        <Stack.Screen
          name="WooMigosView"
          component={WooMigosView}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
        <Stack.Screen
          name="WooCommentsView"
          component={WooCommentsView}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
        <Stack.Screen
          name="WooGalleryView"
          component={WooGalleryView}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
        <Stack.Screen
          name="WooListView"
          component={WooListView}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
        <Stack.Screen
          name="MediaView"
          component={MediaViewScreen}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
        <Stack.Screen
          name="Woo"
          component={WooScreen}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
      </Stack.Navigator>
    );
  };
  
  const NotificationsStack = () => {
    return (
      <Stack.Navigator options={{ headerShown: false }}>
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
      </Stack.Navigator>
    );
  };
  
  const ProfileStack = () => {
    return (
      <Stack.Navigator options={{ headerShown: false }}>
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
        <Stack.Screen
          name="Migos"
          component={MigosScreen}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
        <Stack.Screen
          name="MigoGroups"
          component={MigoGroupsScreen}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
        <Stack.Screen
          name="MigoRequests"
          component={MigoRequestScreen}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
        <Stack.Screen
          name="Menu"
          component={MenuScreen}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicyScreen}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
        <Stack.Screen
          name="WooCommentsView"
          component={WooCommentsView}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
        <Stack.Screen
          name="WooGalleryView"
          component={WooGalleryView}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
        <Stack.Screen
          name="WooListView"
          component={WooListView}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
        <Stack.Screen
          name="MediaView"
          component={MediaViewScreen}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
      </Stack.Navigator>
    );
  };
  
  const CameraStack = () => {
    return (
      <Stack.Navigator options={{ headerShown: false }}>
        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
        <Stack.Screen
          name="EditMedia"
          component={EditMediaScreen}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
        <Stack.Screen
          name="AddMediaWooGallery"
          component={AddMediaWooGalleryView}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
        <Stack.Screen
          name="WooDate"
          component={WooDateScreen}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
        <Stack.Screen
          name="WooTime"
          component={WooTimeScreen}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
        <Stack.Screen
          name="WooLocation"
          component={WooLocationScreen}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
        <Stack.Screen
          name="WooMigos"
          component={WooMigosScreen}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
        <Stack.Screen
          name="WooList"
          component={WooListScreen}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
        <Stack.Screen
          name="WooPreviewEdit"
          component={WooPreviewEditScreen}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
      </Stack.Navigator>
    );
  };
  
  const SearchStack = () => {
    return (
      <Stack.Navigator options={{ headerShown: false }}>
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
      </Stack.Navigator>
    );
  };
  
  const MessagesStack = () => {
    return (
      <Stack.Navigator options={{ headerShown: false }}>
        <Stack.Screen
          name="MessagesPreview"
          component={MessagesPreviewScreen}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
        {/* <Stack.Screen
          name="ComposeMessage"
          component={ComposeMessageScreen}
          options={{ headerShown: false }}
      initialParams={{ user: user, token: token }}
        /> */}
        <Stack.Screen
          name="NewMessage"
          component={NewMessageScreen}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
        <Stack.Screen
          name="MessageDetails"
          component={MessageDetailsScreen}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
        <Stack.Screen
          name="ManageParticipants"
          component={ManageParticipantsScreen}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
        {/* <Stack.Screen
          name="Messages"
          component={MessagesScreen}
          options={{ headerShown: false }}
      initialParams={{ user: user, token: token }}
        /> */}
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: false }}
          initialParams={{ user: user, token: token }}
        />
      </Stack.Navigator>
    );
  };

  console.log("APP");
  const [loading, setLoading] = useState(true);
  const [userState, setUserState] = useState({
    isLoggedIn: false,
    isProfileComplete: false,
  });
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const localhost = "http://192.168.12.240:3000";

  useEffect(() => {
    console.log("UE");
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token");
      setToken(token);
      console.log(`APP JS TOKEN ===s ${token}`);
      if (token) {
        try {
          const response = await fetch(`${localhost}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (response.ok) {
            setUserState({
              isLoggedIn: true,
              isProfileComplete: data.is_profile_complete,
            });
            setUser(data);
            userData = data;
            // console.log(`DATA ===s ${JSON.stringify(data)}`);
          } else {
            setUserState({ isLoggedIn: false, isProfileComplete: false });
          }
        } catch (err) {
          console.error(err);
          setUserState({ isLoggedIn: false, isProfileComplete: false });
        }
      } else {
        setUserState({ isLoggedIn: false, isProfileComplete: false });
        console.log("Actually HERE");
      }

      setLoading(false);
    };

    checkLogin();
  }, [token]);

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Splash Screen</Text>
      </View>
    ); // or a splash screen

  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        {userState.isLoggedIn ? (
          userState.isProfileComplete ? (
            <Tab.Navigator
              screenOptions={{
                tabBarShowLabel: false,
                tabBarActiveTintColor: woo_orange,
                tabBarInactiveTintColor: woo_gray,
                headerShown: false,
              }}
            >
              <Tab.Screen
                name="HomeTab"
                component={HomeStack}
                options={{
                  title: "home",
                  tabBarIcon: ({ color }) => (
                    <Icon
                      name="home"
                      type="font-awesome-5"
                      color={color}
                      size={25}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="ProfileTab"
                component={ProfileStack}
                options={{
                  title: "profile",
                  tabBarIcon: ({ color }) => (
                    <Icon
                      name="user"
                      solid
                      type="font-awesome-5"
                      color={color}
                      size={25}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="CameraTab"
                component={CameraStack}
                options={{
                  title: "camera",
                  tabBarIcon: ({ color }) => (
                    <Icon
                      name="camera"
                      type="font-awesome-5"
                      color={color}
                      size={25}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="SearchTab"
                component={SearchStack}
                options={{
                  title: "search",
                  tabBarIcon: ({ color }) => (
                    <Icon
                      name="search"
                      type="font-awesome-5"
                      color={color}
                      size={25}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="MessagesTab"
                component={MessagesStack}
                options={{
                  title: "messages",
                  // tabBarBadge:
                  //   messagesNotificationCount > 0
                  //     ? messagesNotificationCount
                  //     : undefined,
                  tabBarIcon: ({ color }) => (
                    <Icon
                      name="envelope"
                      solid
                      type="font-awesome-5"
                      color={color}
                      size={25}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="NotificationsTab"
                component={NotificationsStack}
                options={{
                  title: "notifications",
                  // tabBarBadge:
                  //   notificationCount > 0 ? notificationCount : undefined,
                  tabBarIcon: ({ color }) => (
                    <Icon
                      name="bell"
                      solid
                      type="font-awesome-5"
                      color={color}
                      size={25}
                    />
                  ),
                }}
              />
            </Tab.Navigator>
          ) : (
            <OnboardingStack.Navigator>
              <OnboardingStack.Screen
                name="MoreInfo"
                component={MoreInfoScreen}
                options={{ headerShown: false }}
                initialParams={{ user: user, token: token }}
              />
              <AppStack.Screen
                name="Home"
                component={HomeScreen}
                initialParams={{ user: user, token: token }}
              />
            </OnboardingStack.Navigator>
          )
        ) : (
          <Stack.Navigator options={{ headerShown: false }}>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="MoreInfo"
              component={MoreInfoScreen}
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false, gestureEnabled: false }}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

// const App = () => {
//   LogBox.ignoreAllLogs(); //Ignore all log notifications

//   const [isSignedIn, setIsSignedIn] = useState(false);
//   // const [uid, setUID] = useState(null);
//   const [messagesNotificationCount, setMessagesNotificationCount] = useState();
//   const [notificationCount, setNotificationCount] = useState(0);

//   onAuthStateChanged(auth, (user) => {
//     if (user) {
//       setIsSignedIn(true);
//       // setUID(user.uid);
//       uid = user.uid;
//       // ...
//     } else {
//       // User is signed out
//       setIsSignedIn(false);
//     }
//   });

//   return (
//     <GestureHandlerRootView>
//       <NavigationContainer>
//         {isSignedIn ?
// (
//           <Tab.Navigator
//             screenOptions={{
//               tabBarShowLabel: false,
//               tabBarActiveTintColor: woo_orange,
//               tabBarInactiveTintColor: woo_gray,
//               headerShown: false,
//             }}
//           >
//             <Tab.Screen
//               name="HomeTab"
//               component={HomeStack}
//               options={{
//                 title: "home",
//                 tabBarIcon: ({ color }) => (
//                   <Icon
//                     name="home"
//                     type="font-awesome-5"
//                     color={color}
//                     size={25}
//                   />
//                 ),
//               }}
//             />
//             <Tab.Screen
//               name="ProfileTab"
//               component={ProfileStack}
//               options={{
//                 title: "profile",
//                 tabBarIcon: ({ color }) => (
//                   <Icon
//                     name="user"
//                     solid
//                     type="font-awesome-5"
//                     color={color}
//                     size={25}
//                   />
//                 ),
//               }}
//             />
//             <Tab.Screen
//               name="CameraTab"
//               component={CameraStack}
//               options={{
//                 title: "camera",
//                 tabBarIcon: ({ color }) => (
//                   <Icon
//                     name="camera"
//                     type="font-awesome-5"
//                     color={color}
//                     size={25}
//                   />
//                 ),
//               }}
//             />
//             <Tab.Screen
//               name="SearchTab"
//               component={SearchStack}
//               options={{
//                 title: "search",
//                 tabBarIcon: ({ color }) => (
//                   <Icon
//                     name="search"
//                     type="font-awesome-5"
//                     color={color}
//                     size={25}
//                   />
//                 ),
//               }}
//             />
//             <Tab.Screen
//               name="MessagesTab"
//               component={MessagesStack}
//               options={{
//                 title: "messages",
//                 tabBarBadge:
//                   messagesNotificationCount > 0
//                     ? messagesNotificationCount
//                     : undefined,
//                 tabBarIcon: ({ color }) => (
//                   <Icon
//                     name="envelope"
//                     solid
//                     type="font-awesome-5"
//                     color={color}
//                     size={25}
//                   />
//                 ),
//               }}
//             />
//             <Tab.Screen
//               name="NotificationsTab"
//               component={NotificationsStack}
//               options={{
//                 title: "notifications",
//                 tabBarBadge:
//                   notificationCount > 0 ? notificationCount : undefined,
//                 tabBarIcon: ({ color }) => (
//                   <Icon
//                     name="bell"
//                     solid
//                     type="font-awesome-5"
//                     color={color}
//                     size={25}
//                   />
//                 ),
//               }}
//             />
//           </Tab.Navigator>
//         )
// :
// (
//           <Stack.Navigator options={{ headerShown: false }}>
//             <Stack.Screen
//               name="Login"
//               component={LoginScreen}
//               options={{ headerShown: false, gestureEnabled: false }}
//             />
//             <Stack.Screen
//               name="ForgotPassword"
//               component={ForgotPasswordScreen}
//               options={{ headerShown: false, gestureEnabled: false }}
//             />
//             <Stack.Screen
//               name="RegisterFullname"
//               component={RegisterFullnameScreen}
//               options={{ headerShown: false, gestureEnabled: false }}
//             />
//              <Stack.Screen
//               name="MoreInfo"
//               component={MoreInfoScreen}
//               options={{ headerShown: false, gestureEnabled: false }}
//             />
//             <Stack.Screen
//               name="RegisterDOB"
//               component={RegisterDOBScreen}
//               options={{ headerShown: false, gestureEnabled: false }}
//             />
//             <Stack.Screen
//               name="RegisterUsername"
//               component={RegisterUsernameScreen}
//               options={{ headerShown: false, gestureEnabled: false }}
//             />
//             <Stack.Screen
//               name="RegisterProfilePicture"
//               component={RegisterProfilePictureScreen}
//               options={{ headerShown: false, gestureEnabled: false }}
//             />
//             <Stack.Screen
//               name="Register"
//               component={RegisterScreen}
//               options={{ headerShown: false, gestureEnabled: false }}
//             />
//           </Stack.Navigator>
//         )}
//       </NavigationContainer>
//     </GestureHandlerRootView>
//   );
// };

export default App;
