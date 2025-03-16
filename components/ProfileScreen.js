import React, { useEffect, useState } from "react";
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
} from "react-native";
import { Avatar, Tab, TabView, Card, Button } from "@rneui/themed";
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
  const [isProfileOwnedByUser, setIsProfileOwnedByUser] = useState(true);
  const [woos, setWoos] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [profilePicURL, setProfilePicURL] = useState();
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const { width } = Dimensions.get("window");

  const Tab = ({ children }) => <View style={{ width }}>{children}</View>;

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
        setFirstName(doc.data().first_name);
        setLastName(doc.data().last_name);
        setProfilePicURL(doc.data().profile_pic_url);
        setFollowing(doc.data().following);
        setFollowers(doc.data().followers);
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
  }, [uid]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Drawer
          drawerPosition="right"
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          renderDrawerContent={() => {
            return <MenuScreen user={user} />;
          }}
        >
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
                    navigation.navigate("Migos", { indexParam: 0 })
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
                    navigation.navigate("Migos", { indexParam: 1 })
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
                title="edit profile"
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
          {/* <Tab
            value={index}
            onChange={(e) => setIndex(e)}
            indicatorStyle={{
              backgroundColor: woo_orange,
              height: 3,
            }}
            containerStyle={{
              backgroundColor: woo_white,
            }}
            style={styles.tabContainer}
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
            <Tab.Item
              title="subscribed"
              titleStyle={{ fontSize: 12, color: woo_black }}
              icon={{
                name: "bookmark",
                type: "font-awesome-6",
                color: woo_orange,
              }}
            />
          </Tab> */}
          {/* <TabView value={index} onChange={setIndex} animationType="spring">
            <TabView.Item>
              <View style={styles.tabHeader}>
                <ListViewWoos view={"list"} woos={woos} uid={uid} />
              </View>
            </TabView.Item>
            <TabView.Item>
              <View style={styles.tabHeader}>
                <ListViewGallery
                  gallery={gallery}
                  inverted
                  view={"grid"}
                  nav={"MediaView"}
                />
              </View>
            </TabView.Item>
            <TabView.Item>
              <View style={styles.tabHeader}>
                <ListViewGallery
                  gallery={gallery}
                  inverted
                  view={"grid"}
                  nav={"MediaView"}
                />
              </View>
            </TabView.Item>
          </TabView> */}
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 15 }}
          >
            <Tab>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Image
                  style={{ width: 30, height: 24 }}
                  source={require("../assets/woomigo_icon.png")}
                />
                <Text style={{ fontSize: 12 }}>owned woos</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  marginEnd: 20,
                }}
              >
                <View style={{ alignItems: "center" }}>
                  <FontAwesome6Icon
                    style={{ marginHorizontal: 5 }}
                    name="photo-film"
                    size={15}
                    color={woo_orange}
                  />
                  <Text style={{ fontSize: 12 }}>gallery</Text>
                </View>

                <FontAwesome6Icon
                  style={{ marginHorizontal: 5 }}
                  name="arrow-right"
                  size={15}
                  color={woo_black}
                />
              </View>
              <ListViewWoos view={"list"} woos={woos} uid={uid} />
            </Tab>
            <Tab>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <FontAwesome6Icon
                  style={{ marginHorizontal: 5 }}
                  name="photo-film"
                  size={20}
                  color={woo_orange}
                />
                <Text style={{ fontSize: 12 }}>gallery</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginHorizontal: 20,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesome6Icon
                    style={{ marginHorizontal: 5 }}
                    name="arrow-left"
                    size={15}
                    color={woo_black}
                  />
                  <View style={{ alignItems: "center" }}>
                    <Image
                      style={{ width: 20, height: 18 }}
                      source={require("../assets/woomigo_icon.png")}
                    />
                    <Text style={{ fontSize: 12 }}>woos</Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ alignItems: "center" }}>
                    <FontAwesome6Icon
                      style={{ marginHorizontal: 5 }}
                      name="bookmark"
                      solid
                      size={15}
                      color={woo_orange}
                    />
                    <Text style={{ fontSize: 12 }}>subscribed</Text>
                  </View>

                  <FontAwesome6Icon
                    style={{ marginHorizontal: 5 }}
                    name="arrow-right"
                    size={15}
                    color={woo_black}
                  />
                </View>
              </View>
              <ListViewGallery
                gallery={gallery}
                inverted
                view={"grid"}
                nav={"MediaView"}
              />
            </Tab>
            <Tab>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <FontAwesome6Icon
                  style={{ marginHorizontal: 5 }}
                  name="bookmark"
                  solid
                  size={20}
                  color={woo_orange}
                />
                <Text style={{ fontSize: 12 }}>subscribed</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginHorizontal: 20,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesome6Icon
                    style={{ marginHorizontal: 5 }}
                    name="arrow-left"
                    size={15}
                    color={woo_black}
                  />
                  <View style={{ alignItems: "center" }}>
                    <FontAwesome6Icon
                      style={{ marginHorizontal: 5 }}
                      name="photo-film"
                      size={20}
                      color={woo_orange}
                    />
                    <Text style={{ fontSize: 12 }}>gallery</Text>
                  </View>
                </View>
              </View>
              <ListViewWoos view={"list"} woos={woos} uid={uid} />
            </Tab>
          </ScrollView>
        </Drawer>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: woo_white,
  },
  image: {
    backgroundColor: "#d9d9d9",
    height: 300,
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
  tabContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
    marginTop: 5,
    marginBottom: 5,
  },
  tabHeader: {
    // padding: 5,
    alignItems: "center",
  },
  tabText: {
    fontSize: 18,
    color: woo_black,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
