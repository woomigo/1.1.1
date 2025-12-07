import { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { Tab, TabView } from "@rneui/themed";
import ListViewUsers from "./ListViewUsers";
import { woo_black } from "../assets/colors";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import { localhost } from "./utility";

const MigosScreen = ({ navigation, route }) => {
  const {
    indexParam = 0,
    user,
    token,
    userUID,
  } = route.params;

  const [index, setIndex] = useState(0);
  const [following, setFollowing] = useState();
  const [followers, setFollowers] = useState();
  const [username, setUsername] = useState();

  const fetchUserFollow = async (userId, token) => {
    const res = await fetch(`${localhost}/followers/${userId}/network`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setFollowing(data.followees);
    setFollowers(data.followers);
    setUsername(data.user.username);
    setFirstName(data.user.first_name);
    setLastName(data.user.last_name);
    setProfilePicURL(data.user.profile_pic_url);
    if (!res.ok) throw new Error("Failed to fetch follow counts");
    return res.json();
  };

  useEffect(() => {
    setIndex(indexParam);
    fetchUserFollow(userUID ? userUID : user.id, token);
  }, [user, token]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-start",
          }}
        >
          <Pressable onPress={() => navigation.goBack()}>
            <FontAwesome6Icon name="chevron-left" size={24} color={woo_black} />
          </Pressable>
        </View>
        <View
          style={{
            flex: 4,
            flexDirection: "row",
            justifyContent: "flex-start",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: woo_black,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            @{username}
          </Text>
        </View>
        <View
          style={{
            flex: 2,
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          {!userUID && (
            <View
              style={{
                flex: 1,
  
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <Pressable onPress={() => navigation.navigate("MigoGroups")}>
                <FontAwesome6Icon
                  name="user-group"
                  size={26}
                  color={woo_black}
                />
              </Pressable>

              <Pressable onPress={() => navigation.navigate("MigoRequests")}>
                <FontAwesome6Icon
                  name="user-plus"
                  size={26}
                  color={woo_black}
                />
              </Pressable>
            </View>
          )}
        </View>
      </View>
      <Tab
        value={index}
        onChange={(e) => setIndex(e)}
        indicatorStyle={{
          backgroundColor: "#f37320",
          height: 3,
        }}
        containerStyle={{
          marginTop: 30,
          backgroundColor: "white",
        }}
        style={styles.tabContainer}
      >
        <Tab.Item
          title={`followers (${followers && followers.length})`}
          titleStyle={{ fontSize: 12, color: woo_black }}
        />
        <Tab.Item
          title={`following (${following && following.length})`}
          titleStyle={{ fontSize: 12, color: woo_black }}
        />
      </Tab>
      <TabView
        value={index}
        onChange={setIndex}
        animationType="spring"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 4,
          marginTop: 5,
          marginBottom: 5,
        }}
      >
        <TabView.Item style={{ width: "100%" }}>
          <View style={styles.tabHeader}>
            <ListViewUsers
              users={followers}
              onPressUser={(selectedUser) =>
                navigation.push("Profile", {
                  userUID: selectedUser.user_id,
                })
              }
            />
          </View>
        </TabView.Item>
        <TabView.Item style={{ width: "100%" }}>
          <View style={styles.tabHeader}>
            <ListViewUsers
              users={following}
              onPressUser={(selectedUser) =>
                navigation.push("Profile", {
                  userUID: selectedUser.user_id,
                })
              }
            />
          </View>
        </TabView.Item>
      </TabView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileInfo: {
    textAlign: "center",
  },
  header: {
    height: 50,
    alignItems: "flex-end",
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  leftComponent: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerComponent: {
    justifyContent: "center",
    alignItems: "center",
  },
  rightComponent: {
    justifyContent: "center",
    alignItems: "center",
  },
  tabContainer: {},
  tabHeader: {
    marginTop: 10,
  },
  tabText: {
    fontSize: 18,
    color: woo_black,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default MigosScreen;
