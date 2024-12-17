import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Header, Icon, Avatar, Tab, TabView, ButtonGroup } from "@rneui/themed";
import ListViewGallery from "./ListViewGallery";
import ListViewGalleryWoo from "./ListViewGalleryWoo";
import { collection, query, where, onSnapshot, and } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Drawer } from "react-native-drawer-layout";
import { woo_black, woo_gray, woo_orange, woo_white } from "../assets/colors";
import UserMenuScreen from "./UserMenuScreen";

const UserScreen = ({ navigation, route }) => {
  const [isFollowerOrMigo, setIsFollowerOrMigo] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [index, setIndex] = useState(0);
  const [woos, setWoos] = useState();
  const [open, setOpen] = useState(false);

  const { user, uid } = route.params;

  useEffect(() => {
    user.migos.includes(uid) || user.followers.includes(uid)
      ? setIsFollowerOrMigo(true)
      : setIsFollowerOrMigo(false);

    const q = query(
      collection(db, "woos"),
      and(where("owner_uid", "==", user.uid), where("woo_type", "==", "public"))
    );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const ownedPublicWoos = [];
        querySnapshot.forEach((doc) => {
          ownedPublicWoos.push(doc);
        });
        setWoos(ownedPublicWoos);
      },
      (error) => {}
    );
    return () => {
      unsubscribe();
    };
  }, [isFollowerOrMigo]);

  return (
    <View style={styles.container}>
      <Drawer
        drawerPosition="right"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        renderDrawerContent={() => {
          return <UserMenuScreen user={user} />;
        }}
      >
        <Header
          style={styles.header}
          backgroundColor={woo_white}
          leftComponent={
            <Icon
              name={"chevron-left"}
              type="font-awesome-5"
              color={woo_black}
              solid
              size={25}
              onPress={() => navigation.goBack()}
            />
          }
          centerComponent={
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Avatar
                rounded
                size="medium"
                onPress={() => navigation.navigate("Profile")}
                source={{ uri: user.profile_pic_url }}
              />
              <View>
                <Text
                  style={{
                    color: woo_black,
                    marginBottom: 3,
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  @{user.username}
                </Text>
                <Text
                  style={{
                    color: woo_black,
                    marginBottom: 3,
                    textAlign: "center",
                  }}
                >
                  migos: {user.migos.length}
                </Text>
              </View>
            </View>
          }
          rightComponent={
            <Icon
              name={"ellipsis-v"}
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

        <View
          style={{
            flex: 0.1,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            // backgroundColor: 'red'
          }}
        >
          {isFollowerOrMigo ? (
            <TouchableOpacity>
              <Icon
                name="user-minus"
                solid
                type="font-awesome-5"
                color={woo_gray}
                size={25}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity>
              <Icon
                name="user-plus"
                solid
                type="font-awesome-5"
                color={woo_gray}
                size={25}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity>
            <Icon
              name="envelope"
              solid
              type="font-awesome-5"
              color={woo_gray}
              size={25}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon
              name="share"
              solid
              type="font-awesome-5"
              color={woo_gray}
              size={25}
            />
          </TouchableOpacity>
        </View>

        {user.is_private_profile && !isFollowerOrMigo ? (
          <View
            style={{
              flex: 0.3,
              borderColor: woo_black,
              borderWidth: 5,
              margin: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon
              name={"lock"}
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
              {`@${user.username}'s`}
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
          <View>
            <Tab
              value={index}
              onChange={(e) => setIndex(e)}
              indicatorStyle={{
                backgroundColor: woo_orange,
                height: 3,
              }}
              containerStyle={{
                marginTop: 20,
                backgroundColor: "white",
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
                  <Text style={styles.tabText}>Woos</Text>
                  <ListViewGalleryWoo
                    woos={woos}
                    view={"grid"}
                    gridNumOfColumns={2}
                  />
                </View>
              </TabView.Item>
              <TabView.Item style={{ width: "100%" }}>
                <View style={styles.tabHeader}>
                  <Text style={styles.tabText}>Gallery</Text>
                  <ListViewGallery gallery={user.gallery} view={"grid"} />
                </View>
              </TabView.Item>
            </TabView>
          </View>
        )}
      </Drawer>
    </View>
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
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.2,
    elevation: 4,
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

export default UserScreen;
