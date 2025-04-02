import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { Header, Icon, Tab, TabView } from "@rneui/themed";
import { Migos } from "./shared";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  doc,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import ListViewUsers from "./ListViewUsers";
import { woo_black, woo_gray, woo_orange, woo_red } from "../assets/colors";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";

const MigosScreen = ({ navigation, route }) => {
  const { uid, indexParam = 0, userUID } = route.params;

  const userRef = doc(db, "users", uid);

  const [index, setIndex] = useState(0);
  const [following, setFollowing] = useState();
  const [followers, setFollowers] = useState();
  const [migos, setMigos] = useState();
  const [user, setUser] = useState();
  const [username, setUsername] = useState();

  useEffect(() => {
    setIndex(indexParam);
    const docRef = doc(db, "users", userUID ? userUID : uid);
    const getMigos = onSnapshot(docRef, (doc) => {
      // console.log("Document data:", doc.data());
      setUser(doc.data());
      setFollowing(doc.data().following);
      setFollowers(doc.data().followers);
      setMigos(doc.data().migos);
      setUsername(doc.data().username);
    });

    return () => {
      getMigos();
    };
  }, []);

  const addUIDToUserFollowing = async (userUID) => {
    await updateDoc(doc(db, "users", userUID), {
      following: arrayUnion(uid),
    });
  };

  const addUIDToOwnerFollowers = async (userUID) => {
    await updateDoc(userRef, {
      followers: arrayUnion(userUID),
    });
    // setView("success")
  };

  const removeUIDFromUserFollowers = async (userUID) => {
    await updateDoc(doc(db, "users", userUID), {
      followers: arrayRemove(uid),
    });
  };

  const removeUIDFromUserFollowing = async (userUID) => {
    await updateDoc(doc(db, "users", userUID), {
      following: arrayRemove(uid),
    });
  };

  const removeUIDFromOwnerFollowers = async (userUID) => {
    await updateDoc(userRef, {
      followers: arrayRemove(userUID),
    });
  };

  const removeUIDFromOwnerFollowing = async (userUID) => {
    await updateDoc(userRef, {
      following: arrayRemove(userUID),
    });
  };

  const removeUIDFromOwnerMigos = async (userUID) => {
    await updateDoc(userRef, {
      migos: arrayRemove(userUID),
    });
  };

  const removeUIDFromUserMigos = async (userUID) => {
    await updateDoc(doc(db, "users", userUID), {
      migos: arrayRemove(uid),
    });
    // setView("migoRequestSuccess")
  };

  const handleUnfollowMigo = (user) => {
    addUIDToOwnerFollowers(user.uid);
    addUIDToUserFollowing(user.uid);
    // removeUIDFromUserFollowers(user.uid)
    removeUIDFromUserMigos(user.uid);
    removeUIDFromOwnerMigos(user.uid);
    console.log("unfollow MIGO" + " " + user.uid);
  };

  const handleRemoveFollower = (user) => {
    removeUIDFromOwnerFollowers(user.uid);
    removeUIDFromUserFollowing(user.uid);
    console.log("remove Follower" + " " + user.uid);
  };

  const handleUnfollowFollowing = (user) => {
    removeUIDFromOwnerFollowing(user.uid);
    removeUIDFromUserFollowers(user.uid);
    console.log("unfollow Following" + " " + user.uid);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <Header
        style={styles.header}
        backgroundColor={"#fff"}
        leftComponent={
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              name="chevron-left"
              type="font-awesome-5"
              color={woo_black}
              size={25}
              onPress={() => navigation.navigate("Profile")}
            />
            <Text
              style={{
                fontSize: 25,
                color: woo_black,
                textAlign: "center",
                fontWeight: "bold",
                marginStart: 20
              }}
            >
              migos
            </Text>
          </View>
        }
        centerComponent={<View></View>}
        rightComponent={
          <Icon
            name="user-plus"
            type="font-awesome-5"
            color={woo_black}
            size={25}
            onPress={() => navigation.navigate("MigoRequests")}
          />
        }
        rightContainerStyle={styles.rightComponent}
        leftContainerStyle={styles.leftComponent}
        centerContainerStyle={styles.centerComponent}
      /> */}
      <View style={styles.header}>
        <View
          style={{
            // backgroundColor: "blue",
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-start",
          }}
        >
          <Pressable onPress={() => navigation.navigate("Profile")}>
            <FontAwesome6Icon name="chevron-left" size={24} color={woo_black} />
          </Pressable>
        </View>
        <View
          style={{
            // backgroundColor: "blue",
            flex: 1,
            flexDirection: "row",
            // justifyContent: 'center',
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
            flex: 1,
            // backgroundColor: "red",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          {!userUID && (
            <View
              style={{
                flex: 1,
                // backgroundColor: "red",
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
              hideSearchBar
              searchBoxPlaceholder="search followers by @username"
              kind="single"
              singleBtnColor={woo_gray}
              singleBtnText="remove"
              handleSingleBtnOnClick={(user) => handleRemoveFollower(user)}
            />
          </View>
        </TabView.Item>
        <TabView.Item style={{ width: "100%" }}>
          <View style={styles.tabHeader}>
            <ListViewUsers
              users={following}
              hideSearchBar
              searchBoxPlaceholder="search following by @username"
              kind="single"
              singleBtnColor={woo_gray}
              singleBtnText="unfollow"
              handleSingleBtnOnClick={(user) => handleUnfollowFollowing(user)}
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
    // padding: 5,
    // alignItems: 'center'
  },
  tabText: {
    fontSize: 18,
    color: woo_black,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default MigosScreen;
