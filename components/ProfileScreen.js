import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Header, Icon, Avatar, Tab, TabView, } from "@rneui/themed";
import ListViewGallery from "./ListViewGallery";
import { woo_black, woo_orange, woo_white } from "../assets/colors";
import {
  doc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Drawer } from "react-native-drawer-layout";
import MenuScreen from "./MenuScreen";
import ListViewWoos from "./ListViewWoos";

const ProfileScreen = ({ navigation, route }) => {
  const [index, setIndex] = useState(0);
  const [user, setUser] = useState();
  const [isProfileOwnedByUser, setIsProfileOwnedByUser] = useState(true);
  const [woos, setWoos] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState();
  const [profilePicURL, setProfilePicURL] = useState();
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [migos, setMigos] = useState([]);

  const { uid } = route.params;

  useEffect(() => {
    const docRef = doc(db, "users", uid);
    const getProfileInfo = onSnapshot(
      docRef,
      (doc) => {
        console.log("Document data:", doc.data());
        setUser(doc.data());
        setGallery(doc.data().gallery);
        setUsername(doc.data().username);
        setProfilePicURL(doc.data().profile_pic_url);
        setFollowing(doc.data().following);
        setFollowers(doc.data().followers);
        setMigos(doc.data().migos);
      },
      (error) => {},
      []
    );

    const q = query(collection(db, "woos"), where("owner_uid", "==", uid));
    const getOwnedWoos = onSnapshot(
      q,
      (querySnapshot) => {
        const ownedWoos = [];
        querySnapshot.forEach((doc) => {
          ownedWoos.push(doc.data());
        });
        setWoos(ownedWoos);
      },
      (error) => {}
    );

    return () => {
      getProfileInfo();
      getOwnedWoos();
    };
  }, [uid]);

  return (
    <View style={styles.container}>
      <Drawer
        drawerPosition="right"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        renderDrawerContent={() => {
          return <MenuScreen user={user} />;
        }}
      >
        <Header
          containerStyle={styles.header}
          backgroundColor={woo_white}
          leftComponent={
            <Icon
              name={isProfileOwnedByUser ? "users" : "bars"}
              type="font-awesome-5"
              color={woo_black}
              solid
              size={25}
              onPress={
                isProfileOwnedByUser
                  ? () =>
                      navigation.navigate("Migos", {
                        followers: followers,
                        following: following,
                        migos: migos,
                      })
                  : "open drawer"
              }
            />
          }
          centerComponent={
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Avatar
                rounded
                size="large"
                onPress={() => navigation.navigate("Profile")}
                source={{ uri: profilePicURL }}
              />
              <Text
                style={{
                  color: woo_black,
                  marginVertical: 3,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 15,
                }}
              >
                {username}
              </Text>
            </View>
          }
          rightComponent={
            <Icon
              name={"bars"}
              type="font-awesome-5"
              color={woo_black}
              solid
              size={25}
              onPress={() => setOpen((prevOpen) => !prevOpen)}
            />
          }
          rightContainerStyle={styles.rightComponent}
          leftContainerStyle={styles.leftComponent}
          centerContainerStyle={styles.centerComponent}
        />

        <Tab
          value={index}
          onChange={(e) => setIndex(e)}
          indicatorStyle={{
            backgroundColor: woo_orange,
            height: 3,
          }}
          containerStyle={{
            marginTop: 20,
            backgroundColor: woo_white,
          }}
        >
          <Tab.Item
            title="woos"
            titleStyle={{ fontSize: 12, color: woo_black }}
            iconContainerStyle={{
              alignItems: "center",
              justifyContent: "center",
            }}
            icon={
              <Image
                style={{ width: 30, height: 24 }}
                source={require("../assets/woomigo_icon.png")}
              />
            }
          />
          <Tab.Item
            title="gallery"
            titleStyle={{ fontSize: 12, color: woo_black }}
            icon={{
              name: "photo-video",
              type: "font-awesome-5",
              color: woo_orange,
            }}
          />
        </Tab>
        <TabView value={index} onChange={setIndex} animationType="spring">
          <TabView.Item style={{ width: "100%" }}>
            <View style={styles.tabHeader}>
              <ListViewWoos view={"list"} woos={woos} uid={uid} />
            </View>
          </TabView.Item>
          <TabView.Item style={{ width: "100%" }}>
            <View style={styles.tabHeader}>
              <ListViewGallery
                gallery={gallery}
                inverted
                view={"grid"}
                nav={"MediaView"}
              />
            </View>
          </TabView.Item>
        </TabView>
      </Drawer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: woo_white,
  },
  profileInfo: {
    textAlign: "center",
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
  subHeader: {
    marginTop: 10,
    padding: 0,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  tabHeader: {
    marginTop: 10,
    padding: 5,
    alignItems: "center",
  },
  tabText: {
    fontSize: 18,
    color: woo_black,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
