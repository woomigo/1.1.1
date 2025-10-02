import React, { useContext, useEffect, useRef, useState } from "react";
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
import { Avatar, Card, Button, Icon } from "@rneui/themed";
import ListViewGallery from "./ListViewGallery";
import { woo_black, woo_orange, woo_white } from "../assets/colors";
import { Drawer } from "react-native-drawer-layout";
import MenuScreen from "./MenuScreen";
import ListViewWoos from "./ListViewWoos";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import { Switch } from "react-native";
import { truncNumber } from "./utility";
import { AuthContext } from "../context/AuthContext";

const ProfileScreen = ({ navigation, route }) => {
  const [index, setIndex] = useState(0);
  const [isProfileOwnedByUser, setIsProfileOwnedByUser] = useState(false);
  const [woos, setWoos] = useState([]);
  const [subWoos, setSubWoos] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [profilePicURL, setProfilePicURL] = useState();
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [isFollowing, setIsFollowing] = useState();
  const [isFollower, setIsFollower] = useState();
  const [isFollowingRequest, setIsFollowingRequest] = useState();
  const [isProfilePrivate, setIsPofilePrivate] = useState();
  const [followMessage, setFollowMessage] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const indicatorAnim = useRef(new Animated.Value(0)).current;
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const localhost = "http://192.168.12.240:3000";

  const { width } = Dimensions.get("window");

  const { user, token } = useContext(AuthContext);
  const { userUID } = route.params;

  const canPress = isProfileOwnedByUser || isFollowing || !isProfilePrivate;

  const fetchUserFollowCounts = async (userId, token) => {
    if (!token) throw new Error("Auth token is missing");
    if (!userId) throw new Error("User ID is required");

    const res = await fetch(`${localhost}/followers/${userId}/follow-counts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ⬅️ your auth token here
      },
    });

    if (!res.ok) throw new Error("Failed to fetch follow counts");

    const data = await res.json();
    console.log("FOLLOW COUNT IS ======= " + JSON.stringify(data));
    setFollowing(data.followee_count);
    setFollowers(data.follower_count);
    setUsername(data.user.username);
    setFirstName(data.user.first_name);
    setLastName(data.user.last_name);
    setProfilePicURL(data.user.profile_pic_url);
    setIsPofilePrivate(data.user.is_private);

    return res.json();
  };

  const fetchUserFollowers = async (userId, token) => {
    if (!token) throw new Error("Auth token is missing");
    if (!userId) throw new Error("User ID is required");

    const res = await fetch(`${localhost}/followers/${userId}/network`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ⬅️ your auth token here
      },
    });

    if (!res.ok) throw new Error("Failed to fetch followings");

    const data = await res.json();
    console.log("FOLLOWERS OBJECT IS ======= " + JSON.stringify(data));

    setIsFollowing(data.followers.some((f) => f.user_id === user.id));
    setIsFollower(data.followees.some((f) => f.user_id === user.id));

    return res.json();
  };

  const fetchWoos = async (userId, token) => {
    if (!token) throw new Error("Auth token is missing");
    if (!userId) throw new Error("User ID is required");

    console.log(`FETCH WOOS userID -------$$$$$$$$ ${userId}`);

    const res = await fetch(
      `${localhost}/woos/${userUID ? `user/${userId}` : "mine"}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ⬅️ your auth token here
        },
      }
    );

    if (!res.ok) throw new Error("Failed to fetch woos");

    const data = await res.json();
    console.log("PROFILE WOOS OBJECT IS ======= " + JSON.stringify(data));

    setWoos(data);

    return res.json();
  };

  const fetchGallery = async (userId, token) => {
    if (!token) throw new Error("Auth token is missing");
    if (!userId) throw new Error("User ID is required");

    const res = await fetch(`${localhost}/galleries/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ⬅️ your auth token here
      },
    });

    if (!res.ok) throw new Error("Failed to fetch woos");

    const data = await res.json();
    console.log("Gallery OBJECT IS ======= " + JSON.stringify(data));

    setGallery(data);

    return res.json();
  };

  const fetchSubs = async (userId, token) => {
    if (!token) throw new Error("Auth token is missing");
    if (!userId) throw new Error("User ID is required");

    console.log(`FETCH WOOS userID -------$$$$$$$$ ${userId}`);

    const res = await fetch(
      `${localhost}/subscriptions/${userUID ? `user/${userId}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ⬅️ your auth token here
        },
      }
    );

    if (!res.ok) throw new Error("Failed to fetch woos");

    const data = await res.json();
    console.log("SUBS OBJECT IS ======= " + JSON.stringify(data));

    setSubWoos(data);

    return res.json();
  };

  const fetchIsFollowRequest = async (uid, userId, token) => {
    if (!token) throw new Error("Auth token is missing");
    if (!userId) throw new Error("User ID is required");

    const res = await fetch(
      `${localhost}/follow-requests/check?sender_id=${uid}&receiver_id=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ⬅️ your auth token here
        },
      }
    );

    if (!res.ok) throw new Error("Failed to fetch followings");

    const data = await res.json();
    console.log("FOLLOWER Request OBJECT IS ======= " + JSON.stringify(data));

    setIsFollowingRequest(data);

    return res.json();
  };

  const fetchSendFollowRequest = async (sender_id, receiver_id, token) => {
    if (!token) throw new Error("Auth token is missing");
    if (!sender_id) throw new Error("Sender ID is required");
    if (!receiver_id) throw new Error("Receiver ID is required");
    try {
      const res = await fetch(`${localhost}/follow-requests/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ⬅️ your auth token here
        },
        body: JSON.stringify({ sender_id, receiver_id }),
      });

      if (!res.ok) throw new Error("Failed to fetch followings");

      const data = await res.json();
      console.log(
        "SEND FOLLOWER Request OBJECT IS ======= " + JSON.stringify(data)
      );
      setIsFollowingRequest({
        exists: true,
        request: {
          status: "pending",
        },
      });
      showTemporaryFollowMessage("request sent!");
      return data;
    } catch (err) {
      console.error(err);
      showTemporaryFollowMessage("Error following");
    }
  };

  const fetchCancelFollowRequest = async (sender_id, receiver_id, token) => {
    if (!token) throw new Error("Auth token is missing");
    if (!sender_id) throw new Error("Sender ID is required");
    if (!receiver_id) throw new Error("Receiver ID is required");
    try {
      const res = await fetch(`${localhost}/follow-requests/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ⬅️ your auth token here
        },
        body: JSON.stringify({ sender_id, receiver_id }),
      });

      if (!res.ok) throw new Error("Failed to fetch followings");

      const data = await res.json();
      console.log(
        "CANCEL FOLLOWER Request OBJECT IS ======= " + JSON.stringify(data)
      );
      setIsFollowingRequest({
        exists: false,
      });
      showTemporaryFollowMessage("request cancelled!");
      return data;
    } catch (err) {
      console.error(err);
      showTemporaryFollowMessage("Error canceling");
    }
  };

  const fetchFollowUser = async (follower_id, followee_id, token) => {
    if (!token) throw new Error("Auth token is missing");
    if (!follower_id) throw new Error("Follower ID is required");
    if (!followee_id) throw new Error("Followee ID is required");
    try {
      const res = await fetch(`${localhost}/followers/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ⬅️ your auth token here
        },
        body: JSON.stringify({ follower_id, followee_id }),
      });

      if (!res.ok) throw new Error("Failed to fetch follow user");

      const data = await res.json();
      console.log("FOLLOWER Request OBJECT IS ======= " + JSON.stringify(data));
      setIsFollowing(true);
      showTemporaryFollowMessage("following!");
      return data;
    } catch (err) {
      console.error(err);
      showTemporaryFollowMessage("Error following user");
    }
  };

  const fetchUnfollowUser = async (follower_id, followee_id, token) => {
    if (!token) throw new Error("Auth token is missing");
    if (!follower_id) throw new Error("Follower ID is required");
    if (!followee_id) throw new Error("Followee ID is required");
    try {
      const res = await fetch(`${localhost}/followers/unfollow`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ⬅️ your auth token here
        },
        body: JSON.stringify({ follower_id, followee_id }),
      });

      if (!res.ok) throw new Error("Failed to fetch un follow user");

      const data = await res.json();
      console.log("FOLLOWER Request OBJECT IS ======= " + JSON.stringify(data));
      setIsFollowing(false);
      showTemporaryFollowMessage("unfollowed!");
      return data;
    } catch (err) {
      console.error(err);
      showTemporaryFollowMessage("Error unfollowing user");
    }
  };

  useEffect(() => {

  console.log(`USER FOR PROFILE IS ${JSON.stringify(user)}`)
    setIsProfileOwnedByUser(!userUID);

    Animated.spring(indicatorAnim, {
      toValue: activeTab * (width / (isProfileOwnedByUser ? 3 : 2)),
      useNativeDriver: true,
    }).start();

    fetchUserFollowCounts(userUID ? userUID : user.id, token);
    fetchUserFollowers(userUID ? userUID : user.id, token);
    fetchWoos(userUID ? userUID : user.id, token);
    fetchSubs(userUID ? userUID : user.id, token);
    fetchGallery(userUID ? userUID : user.id, token);
    if (!isProfileOwnedByUser && !isFollowing)
      fetchIsFollowRequest(user.id, userUID, token);
  }, [isProfileOwnedByUser, isFollowing, activeTab]);

  const renderTabBar = () => {
    const tabs = isProfileOwnedByUser
      ? ["woos", "gallery", "subscribed"]
      : ["woos", "gallery"]; // omit "subscribed" tab if not user's profile

    return (
      <View style={styles.tabBarContainer}>
        <View style={styles.tabBar}>
          {tabs.map((label, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.tab, { width: width / tabs.length }]}
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
                width: width / tabs.length,
              },
            ]}
          />
        </View>
      </View>
    );
  };

  const showTemporaryFollowMessage = (message) => {
    setFollowMessage(message);
    setTimeout(() => setFollowMessage(null), 3000); // Clear after 3 seconds
  };

  const handleCancelFollowRequest = async (userId) => {
    console.log(`Follow request canceled clicked for ${userId}`);
    await fetchCancelFollowRequest(user.id, userId, token);
  };

  const handleSendFollowRequest = async (userId) => {
    console.log(`Follow request sent clicked for ${userId}`);
    await fetchSendFollowRequest(user.id, userId, token);
  };

  const handleUnfollow = async (userId) => {
    console.log(`UNFOLLOW Clicked for userId - ${userId}`);
    await fetchUnfollowUser(user.id, userUID, token);
  };

  const handleFollow = async (userUID) => {
    console.log(`FOLLOW Clicked for userId - ${userUID}`);
    await fetchFollowUser(user.id, userUID, token);
  };

  const getFollowButtonState = () => {
    if (isProfileOwnedByUser) {
      return {
        title: "edit profile",
        onPress: () => navigation.navigate("EditProfile"),
      };
    }

    if (isFollowing) {
      return {
        title: "unfollow",
        onPress: () => handleUnfollow(userUID),
      };
    }

    if (
      isFollowingRequest?.exists &&
      isFollowingRequest.request.status === "pending"
    ) {
      return {
        title: "request pending",
        onPress: () => handleCancelFollowRequest(userUID), // maybe disable or show toast
      };
    }

    // Follow back for private profile
    if (!isFollowing && isFollower && isProfilePrivate) {
      return {
        title: "follow back",
        onPress: () => handleSendFollowRequest(userUID),
      };
    }

    // Follow back for public profile
    if (!isFollowing && isFollower && !isProfilePrivate) {
      return {
        title: "follow back",
        onPress: () => handleFollow(userUID),
      };
    }

    // Regular follow for private profile
    if (!isFollowing && isProfilePrivate) {
      return {
        title: "follow",
        onPress: () => handleSendFollowRequest(userUID),
      };
    }

    return {
      title: "follow",
      onPress: () => handleFollow(userUID),
    };
  };

  const followButton = getFollowButtonState();

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
                  onPress={
                    canPress
                      ? () =>
                          navigation.push("Migos", {
                            indexParam: 0,
                            userUID: userUID,
                          })
                      : null
                  }
                >
                  <Text
                    style={{
                      color: woo_black,
                      fontSize: 12,
                    }}
                  >
                    {truncNumber(followers)}
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
                  onPress={
                    canPress
                      ? () =>
                          navigation.push("Migos", {
                            indexParam: 1,
                            userUID: userUID,
                            isProfileOwnedByUser: isProfileOwnedByUser,
                          })
                      : null
                  }
                >
                  <Text
                    style={{
                      color: woo_black,
                      fontSize: 12,
                    }}
                  >
                    {truncNumber(following)}
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
                title={followMessage || followButton.title}
                buttonStyle={{
                  backgroundColor: woo_black,
                  borderRadius: 30,
                  paddingHorizontal: 15,
                }}
                titleStyle={{ fontSize: 12 }}
                onPress={followButton.onPress}
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
                  disabled={!canPress}
                />
              </View>
            </View>
          </Card>
          {!canPress ? (
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
              {renderTabBar()}

              {activeTab === 0 && (
                <ListViewWoos view={"list"} woos={woos} uid={user.id} />
              )}
              {activeTab === 1 && (
                <ListViewGallery
                  gallery={gallery}
                  inverted
                  view={"grid"}
                  nav={"MediaView"}
                />
              )}
              {isProfileOwnedByUser && activeTab === 2 && (
                <ListViewWoos view={"list"} woos={subWoos} uid={user.id} />
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
