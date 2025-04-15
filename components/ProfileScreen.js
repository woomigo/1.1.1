import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  Platform,
  ScrollView,
  Dimensions,
  Pressable,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Avatar, Tab, TabView, Card, Button, Icon } from "@rneui/themed";
import ListViewGallery from "./ListViewGallery";
import { woo_black, woo_orange, woo_white } from "../assets/colors";
import {
  doc,
  collection,
  query,
  where,
  onSnapshot,
  and,
  or,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Drawer } from "react-native-drawer-layout";
import MenuScreen from "./MenuScreen";
import ListViewWoos from "./ListViewWoos";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import { Switch } from "react-native";

const ProfileScreen = ({ navigation, route }) => {
  const [index, setIndex] = useState(0);
  const [user, setUser] = useState();
  const [isProfileOwnedByUser, setIsProfileOwnedByUser] = useState(false);
  const [woos, setWoos] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [profilePicURL, setProfilePicURL] = useState();
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [isFollowing, setIsFollowing] = useState();
  const [isProfilePrivate, setIsPofilePrivate] = useState();
  const [isEnabled, setIsEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const indicatorAnim = useRef(new Animated.Value(0)).current;
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const { width } = Dimensions.get("window");

  const { uid, userUID } = route.params;

  useEffect(() => {
    console.log(`USERUID ======s ${userUID}`);
    setIsProfileOwnedByUser(!userUID);

    Animated.spring(indicatorAnim, {
      toValue: activeTab * (width / 3),
      useNativeDriver: true,
    }).start();

    const docRef = doc(db, "users", userUID ? userUID : uid);
    const getProfileInfo = onSnapshot(
      docRef,
      (doc) => {
        // console.log("Document data:", doc.data());
        setUser(doc.data());
        setGallery(doc.data().gallery);
        setUsername(doc.data().username);
        setFirstName(doc.data().first_name);
        setLastName(doc.data().last_name);
        setProfilePicURL(doc.data().profile_pic_url);
        setFollowing(doc.data().following);
        setFollowers(doc.data().followers);
        setIsPofilePrivate(doc.data().is_private_profile);
        setIsFollowing(doc.data().followers.includes(uid));
      },
      (error) => {},
      []
    );

    const q = query(
      collection(db, "woos"),
      or(
        where("owner_uid", "==", uid),
        where("woo_migos", "array-contains", uid)
      )
    );
    const getOwnedWoos = onSnapshot(
      q,
      (querySnapshot) => {
        const ownedWoos = [];
        querySnapshot.forEach((doc) => {
          ownedWoos.push(doc);
        });
        setWoos(ownedWoos);
      },
      (error) => {}
    );

    return () => {
      getProfileInfo();
      getOwnedWoos();
    };
  }, [uid, activeTab]);

  const renderTabBar = () => (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {["woos", "gallery", "subscribed"].map((label, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, { width: width / 3 }]}
            onPress={() => setActiveTab(index)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === index && styles.activeTabText,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
        <Animated.View
          style={[
            styles.indicator,
            {
              transform: [{ translateX: indicatorAnim }],
              width: width / 3,
            },
          ]}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Drawer
        drawerPosition="right"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        renderDrawerContent={() => {
          return <MenuScreen user={user} />;
        }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.topButtonsContainer}>
            <View
              style={[
                styles.topButtons,
                isProfileOwnedByUser && { justifyContent: "flex-end" },
              ]}
            >
              {!isProfileOwnedByUser && (
                <View style={styles.topButtonBackground}>
                  <FontAwesome6Icon
                    name="angle-left"
                    style={{}}
                    size={30}
                    color={woo_white}
                    onPress={() => navigation.goBack()}
                  />
                </View>
              )}
              <View style={styles.topButtonBackground}>
                {isProfileOwnedByUser ? (
                  <FontAwesome6Icon
                    name={"bars"}
                    style={{}}
                    size={30}
                    color={woo_white}
                    onPress={() => setOpen((prevOpen) => !prevOpen)}
                  />
                ) : (
                  <FontAwesome6Icon
                    name={"envelope"}
                    style={{}}
                    size={30}
                    color={woo_white}
                    onPress={() => messageUser()}
                  />
                )}
              </View>
            </View>
          </View>

          <Image style={styles.image} source={{ uri: profilePicURL }} />

          <Card
            containerStyle={{
              borderRadius: 20,
              marginTop: -60,
              marginBottom: 10,
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.25,
                  shadowRadius: 2.5,
                },
                android: {
                  elevation: 4,
                },
              }),
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ flexDirection: "row" }}>
                <Avatar
                  rounded
                  size="medium"
                  onPress={() => navigation.navigate("Profile")}
                  source={{ uri: profilePicURL }}
                />
                <View style={{ justifyContent: "center", marginStart: 5 }}>
                  <Text
                    style={{
                      color: woo_black,
                      fontWeight: "bold",
                      fontSize: 14,
                    }}
                  >
                    {firstName} {lastName}
                  </Text>
                  <Text
                    style={{
                      color: woo_black,
                      fontSize: 12,
                    }}
                  >
                    @{username}
                  </Text>
                </View>
              </View>
              {!isProfileOwnedByUser && (
                <View style={{ marginEnd: 10 }}>
                  <FontAwesome6Icon
                    name="ellipsis"
                    style={{}}
                    size={20}
                    color={woo_black}
                    onPress={() => userMenu()}
                  />
                </View>
              )}
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Pressable
                  style={{ alignItems: "center" }}
                  onPress={() =>
                    navigation.push("Migos", {
                      indexParam: 0,
                      userUID: userUID,
                    })
                  }
                >
                  <Text
                    style={{
                      color: woo_black,
                      fontSize: 12,
                    }}
                  >
                    {followers.length}
                  </Text>
                  <Text
                    style={{
                      color: woo_black,
                      fontSize: 12,
                    }}
                  >
                    followers
                  </Text>
                </Pressable>
              </View>
              <View>
                <Pressable
                  style={{ alignItems: "center" }}
                  onPress={() =>
                    navigation.push("Migos", {
                      indexParam: 1,
                      userUID: userUID,
                    })
                  }
                >
                  <Text
                    style={{
                      color: woo_black,
                      fontSize: 12,
                    }}
                  >
                    {following.length}
                  </Text>
                  <Text
                    style={{
                      color: woo_black,
                      fontSize: 12,
                    }}
                  >
                    following
                  </Text>
                </Pressable>
              </View>
              <Button
                title={
                  isProfileOwnedByUser
                    ? "edit profile"
                    : isFollowing
                    ? "unfollow"
                    : "follow"
                }
                buttonStyle={{
                  backgroundColor: woo_black,
                  borderRadius: 30,
                  paddingHorizontal: 15,
                }}
                titleStyle={{ fontSize: 12 }}
              />
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <FontAwesome6Icon
                  style={{ marginEnd: 5 }}
                  name="list"
                  size={20}
                  color={woo_black}
                />
                <Switch
                  trackColor={{ false: "#767577", true: woo_orange }}
                  // thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
              </View>
            </View>
          </Card>
          {!isProfileOwnedByUser && !isFollowing && isProfilePrivate ? (
            // locked profile ui
            <View
              style={{
                flex: 1,
                // borderColor: woo_black,
                // borderWidth: 5,
                margin: 5,
                marginTop: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon
                name={"user-lock"}
                type="font-awesome-5"
                color={woo_black}
                size={40}
                style={{ margin: 5 }}
              />
              <Text
                style={{
                  color: woo_black,
                  marginBottom: 3,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 18,
                }}
              >
                {`@${username}'s`}
              </Text>
              <Text
                style={{
                  color: woo_black,
                  marginBottom: 3,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 18,
                }}
              >
                profile is private
              </Text>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={styles.container}
              stickyHeaderIndices={[0]}
            >
              {/* Tab Switcher */}
              {renderTabBar()}

              {activeTab === 0 && (
                <ListViewWoos view={"list"} woos={woos} uid={uid} />
              )}
              {activeTab === 1 && (
                <ListViewGallery
                  gallery={gallery}
                  inverted
                  view={"grid"}
                  nav={"MediaView"}
                />
              )}
              {activeTab === 2 && (
                <ListViewWoos view={"list"} woos={woos} uid={uid} />
              )}
            </ScrollView>
          )}
        </ScrollView>
      </Drawer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: woo_white,
  },
  topButtonsContainer: {
    flex: 1,
    flexDirection: "row",
    // backgroundColor: "blue",
    position: "absolute",
    zIndex: 1,
  },
  topButtons: {
    flex: 1,
    margin: 10,
    marginHorizontal: 20,
    flexDirection: "row",
    // position: "absolute",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: "red",
  },
  topButtonBackground: {
    height: 45,
    width: 45,
    backgroundColor: "#d9d9d999",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 23,
  },
  image: {
    backgroundColor: "#d9d9d9",
    height: 300,
  },
  profileInfo: {
    textAlign: "center",
  },
  tabBarContainer: {
    backgroundColor: "#fff",
    zIndex: 10,
  },
  tabBar: {
    flexDirection: "row",
    position: "relative",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tab: {
    alignItems: "center",
    paddingVertical: 12,
  },
  tabText: {
    fontSize: 12,
    color: "#666",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "bold",
  },
  indicator: {
    position: "absolute",
    bottom: 0,
    height: 3,
    backgroundColor: woo_orange,
  },
});

export default ProfileScreen;
