import { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthContext } from "./context/AuthContext";
import { View, Text } from "react-native";
import { Icon } from "@rneui/themed";

// Import screens
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

import MessageDetailsScreen from "./components/MessagesDetails";
import NewMessageScreen from "./components/NewMessageScreen";
import ManageParticipantsScreen from "./components/ManageParticipantsScreen";
import MoreInfoScreen from "./components/MoreInfoScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StoryViewerScreen from "./components/StoryViewerScreen";
import MediaGalleryWithPreview from "./components/MediaGalleryWithPreview";
import WooListItems from "./components/WooListItems";
import WooTagsScreen from "./components/WooTagsScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = ({ user, token }) => {
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
        options={{
          headerShown: false,
          stackPresentation: "modal", // or 'fullScreenModal' or 'transparentModal'
          gestureDirection: "vertical", // set vertical swipe direction
        }}
        initialParams={{ user: user, token: token }}
      />
      <Stack.Screen
        name="WooCommentsView"
        component={WooCommentsView}
        options={{
          headerShown: false,
          stackPresentation: "modal", // or 'fullScreenModal' or 'transparentModal'
          gestureDirection: "vertical", // set vertical swipe direction
        }}
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
        name="WooList"
        component={WooListItems}
        options={{
          headerShown: false,
          stackPresentation: "modal", // or 'fullScreenModal' or 'transparentModal'
          gestureDirection: "vertical", // set vertical swipe direction
        }}
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
      <Stack.Screen
        name="MediaGallery"
        component={MediaGalleryWithPreview}
        options={{
          headerShown: false,
          stackPresentation: "modal", // or 'fullScreenModal' or 'transparentModal'
          gestureDirection: "vertical", // set vertical swipe direction
        }}
        initialParams={{ user: user, token: token }}
      />
      <Stack.Screen
        name="StoryViewer"
        component={StoryViewerScreen}
        options={{
          headerShown: false,
          animation: "none", // disable native animation
          stackPresentation: "modal", // or 'fullScreenModal' or 'transparentModal'
          gestureDirection: "vertical", // set vertical swipe direction
        }}
        initialParams={{ user: user, token: token }}
      />
    </Stack.Navigator>
  );
};

const NotificationsStack = ({ user, token }) => {
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

const ProfileStack = ({ user, token }) => {
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
        options={{
          headerShown: false,
          stackPresentation: "modal", // or 'fullScreenModal' or 'transparentModal'
          gestureDirection: "vertical", // set vertical swipe direction
        }}
        initialParams={{ user: user, token: token }}
      />
      <Stack.Screen
        name="WooMigosView"
        component={WooMigosView}
        options={{
          headerShown: false,
          stackPresentation: "modal", // or 'fullScreenModal' or 'transparentModal'
          gestureDirection: "vertical", // set vertical swipe direction
        }}
        initialParams={{ user: user, token: token }}
      />
      <Stack.Screen
        name="WooGalleryView"
        component={WooGalleryView}
        options={{
          headerShown: false,
          stackPresentation: "modal", // or 'fullScreenModal' or 'transparentModal'
          gestureDirection: "vertical", // set vertical swipe direction
        }}
        initialParams={{ user: user, token: token }}
      />
      <Stack.Screen
        name="WooListView"
        component={WooListView}
        options={{
          headerShown: false,
          stackPresentation: "modal", // or 'fullScreenModal' or 'transparentModal'
          gestureDirection: "vertical", // set vertical swipe direction
        }}
        initialParams={{ user: user, token: token }}
      />
      <Stack.Screen
        name="WooList"
        component={WooListItems}
        options={{
          headerShown: false,
          stackPresentation: "modal", // or 'fullScreenModal' or 'transparentModal'
          gestureDirection: "vertical", // set vertical swipe direction
        }}
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
      <Stack.Screen
        name="MediaGallery"
        component={MediaGalleryWithPreview}
        options={{
          headerShown: false,
          stackPresentation: "modal", // or 'fullScreenModal' or 'transparentModal'
          gestureDirection: "vertical", // set vertical swipe direction
        }}
        initialParams={{ user: user, token: token }}
      />
    </Stack.Navigator>
  );
};

const CameraStack = ({ user, token }) => {
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
        name="WooTags"
        component={WooTagsScreen}
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

const SearchStack = ({ user, token }) => {
  return (
    <Stack.Navigator options={{ headerShown: false }}>
      <Stack.Screen
        name="Search"
        component={SearchScreen}
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
        name="WooList"
        component={WooListItems}
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
      <Stack.Screen
        name="MediaGallery"
        component={MediaGalleryWithPreview}
        options={{
          headerShown: false,
          // animation: "none", // disable native animation
          // disable native swipe-to-dismiss
          stackPresentation: "modal", // or 'fullScreenModal' or 'transparentModal'
          gestureDirection: "vertical", // set vertical swipe direction
        }}
        initialParams={{ user: user, token: token }}
      />
    </Stack.Navigator>
  );
};

const MessagesStack = ({ user, token }) => {
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

const MainTabs = ({ user, token }) => (
  <Tab.Navigator
    initialRouteName="HomeTab"
    screenOptions={{
      tabBarShowLabel: false,
      tabBarActiveTintColor: woo_orange,
      tabBarInactiveTintColor: woo_gray,
      headerShown: false,
    }}
  >
    <Tab.Screen
      name="HomeTab"
      options={{
        title: "home",
        tabBarIcon: ({ color }) => (
          <Icon name="home" type="font-awesome-5" color={color} size={25} />
        ),
      }}
    >
      {() => <HomeStack user={user} token={token} />}
    </Tab.Screen>
    <Tab.Screen
      name="ProfileTab"
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
    >
      {() => <ProfileStack user={user} token={token} />}
    </Tab.Screen>
    <Tab.Screen
      name="CameraTab"
      options={{
        title: "camera",
        tabBarIcon: ({ color }) => (
          <Icon name="camera" type="font-awesome-5" color={color} size={25} />
        ),
      }}
    >
      {() => <CameraStack user={user} token={token} />}
    </Tab.Screen>
    <Tab.Screen
      name="SearchTab"
      options={{
        title: "search",
        tabBarIcon: ({ color }) => (
          <Icon name="search" type="font-awesome-5" color={color} size={25} />
        ),
      }}
    >
      {() => <SearchStack user={user} token={token} />}
    </Tab.Screen>
    <Tab.Screen
      name="MessagesTab"
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
    >
      {() => <MessagesStack user={user} token={token} />}
    </Tab.Screen>
    <Tab.Screen
      name="NotificationsTab"
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
    >
      {() => <NotificationsStack user={user} token={token} />}
    </Tab.Screen>
  </Tab.Navigator>
);

const Navigation = () => {
  const { user, loading, token } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView>
      <NavigationContainer independent={true}>
        {user ? (
          user.is_profile_complete ? (
            <MainTabs user={user} token={token} />
          ) : (
            <Stack.Navigator>
              <Stack.Screen
                name="MoreInfo"
                component={MoreInfoScreen}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          )
        ) : (
          <Stack.Navigator>
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
              name="RegisterFullname"
              component={RegisterFullnameScreen}
              options={{ headerShown: false, gestureEnabled: false }}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default Navigation;
