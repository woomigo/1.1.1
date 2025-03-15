import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Header, Icon, Avatar, Tab, TabView, ButtonGroup } from "@rneui/themed";
import ListViewGallery from "./ListViewGallery";
import ListViewGalleryWoo from "./ListViewGalleryWoo";
import {
  collection,
  query,
  where,
  onSnapshot,
  and,
  doc,
  arrayRemove,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Drawer } from "react-native-drawer-layout";
import { woo_black, woo_gray, woo_orange, woo_white } from "../assets/colors";
import UserMenuScreen from "./UserMenuScreen";

const UserScreen = ({ navigation, route }) => {
  const [isFollowerOrMigo, setIsFollowerOrMigo] = useState(false);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [woos, setWoos] = useState();
  const [open, setOpen] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [username, setUsername] = useState();
  const [isPrivateProfile, setIsPrivateProfile] = useState();
  const [profilePicURL, setProfilePicURL] = useState();
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [migos, setMigos] = useState([]);
  const [receivedMigoRequests, setReceivedMigoRequests] = useState();

  const { user, uid } = route.params;

  const userRef = doc(db, "users", uid);

  useEffect(() => {
    user.migos.includes(uid) || user.followers.includes(uid)
      ? setIsFollowerOrMigo(true)
      : setIsFollowerOrMigo(false);

    const docRef = doc(db, "users", user.uid);
    const getProfileInfo = onSnapshot(
      docRef,
      (doc) => {
        console.log("Document data:", doc.data());
        setGallery(doc.data().gallery);
        setUsername(doc.data().username);
        setIsPrivateProfile(doc.data().is_private_profile);
        setProfilePicURL(doc.data().profile_pic_url);
        setFollowing(doc.data().following);
        setFollowers(doc.data().followers);
        setMigos(doc.data().migos);
        setReceivedMigoRequests(doc.data().received_migo_requests);
      },
      (error) => {},
      []
    );

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

    console.log(`FOLLOWERS ${followers} MIGOS ${migos}`);

    return () => {
      getProfileInfo();
      unsubscribe();
    };
  }, []);

  const addUIDToOwnerFollowing = async () => {
    await updateDoc(userRef, {
      following: arrayUnion(user.uid),
    });
  };

  const addUIDToUserFollowers = async () => {
    await updateDoc(doc(db, "users", user.uid), {
      followers: arrayUnion(uid),
    });
  };

  const addUIDToUserFollowing = async () => {
    await updateDoc(doc(db, "users", user.uid), {
      following: arrayUnion(uid),
    });
  };

  const addUIDToOwnerRequestSent = async () => {
    await updateDoc(userRef, {
      sent_migo_requests: arrayUnion(user.uid),
    });
    console.log("OWNER REQUEST SENT TO USER");
  };

  const addUIDToUserRequestReceived = async () => {
    await updateDoc(doc(db, "users", user.uid), {
      received_migo_requests: arrayUnion(uid),
    });
    console.log("USER RECEIVES REQUEST FROM OWNER");
  };

  const removeUIDFromOwnerSent = async () => {
    console.log("REMOVEFROMOWNER");
    await updateDoc(userRef, {
      sent_migo_requests: arrayRemove(user.uid),
    });
  };

  const removeUIDFromUserReceived = async () => {
    console.log("REMOVEFROMUSER");
    await updateDoc(doc(db, "users", user.uid), {
      received_migo_requests: arrayRemove(uid),
    });
    // setView("migoRequestSuccess")
  };

  const addUIDToOwnerMigos = async () => {
    await updateDoc(userRef, {
      migos: arrayUnion(user.uid),
    });
  };

  const addUIDToUserMigos = async () => {
    await updateDoc(doc(db, "users", user.uid), {
      migos: arrayUnion(uid),
    });
  };

  const removeUIDToOwnerMigos = async () => {
    await updateDoc(userRef, {
      migos: arrayRemove(user.uid),
    });
  };

  const removeUIDToUserMigos = async () => {
    await updateDoc(doc(db, "users", user.uid), {
      migos: arrayRemove(uid),
    });
  };

  const removeUIDFromUserFollowers = async () => {
    await updateDoc(doc(db, "users", user.uid), {
      followers: arrayRemove(uid),
    });
  };
  const removeUIDFromUserFollowing = async () => {
    await updateDoc(doc(db, "users", user.uid), {
      following: arrayRemove(uid),
    });
  };

  const handleFollowUser = () => {
    console.log(`FOLLOW!!!! ${username}`);
    setLoading("");
    if (isPrivateProfile === false) {
      addUIDToOwnerFollowing();
      addUIDToUserFollowers();
    } else if (isPrivateProfile === true) {
      addUIDToOwnerRequestSent();
      addUIDToUserRequestReceived();
    }
  };

  const handleAddMigo = () => {
    setLoading("");
    if (isPrivateProfile === false) {
      addUIDToOwnerMigos();
      addUIDToUserMigos();
      removeUIDFromUserFollowing();
    } else if (isPrivateProfile === true) {
      addUIDToOwnerRequestSent();
      addUIDToUserRequestReceived();
    }
  };

  const handleUnfollow = () => {
    if (migos.includes(uid)) {
      removeUIDToOwnerMigos();
      removeUIDToUserMigos();
      addUIDToUserFollowing();
      setLoading("");
    } else if (followers.includes(uid)) {
      removeUIDFromUserFollowers();
    }
  };

  const handleCancelMigoRequest = () => {
    console.log("HANDLE CANCEL");
    removeUIDFromOwnerSent();
    removeUIDFromUserReceived();
  };

  const handleUserFollowed = () => {
    console.log("YUP IT WORKED!!!");
  };

  const onUnfollowSubmit = () => {
    console.log("UNFOLLOW");
    handleUnfollow();
  };

  const onCancelMigoRequestSubmit = () => {
    console.log("CANCEL");
    if (receivedMigoRequests.includes(uid)) {
      handleCancelMigoRequest();
    }
  };

  const onfollowMigoRequestsSubmit = () => {
    if (following.includes(uid)) {
      //migo or migo request
      console.log(
        "They're following me and now this is a request to become a migo"
      );
      handleAddMigo();
    } else if (!migos.includes(uid) || !followers.includes(uid)) {
      //follow or follow request
      console.log(
        "We're not migos and I don't already follow them and this is a request to follow them"
      );
      handleFollowUser();
    }
  };

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
                source={{ uri: profilePicURL }}
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
                  @{username}
                </Text>
                <Text
                  style={{
                    color: woo_black,
                    marginBottom: 3,
                    textAlign: "center",
                  }}
                >
                  migos: {migos.length}
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
            <TouchableOpacity
              onPress={() => {
                onUnfollowSubmit();
              }}
            >
              <Icon
                name="user-minus"
                solid
                type="font-awesome-5"
                color={woo_gray}
                size={25}
                onPress={() => {
                  onUnfollowSubmit();
                }}
              />
            </TouchableOpacity>
          ) : user.received_migo_requests.includes(uid) ? (
            <TouchableOpacity onPress={() => onCancelMigoRequestSubmit()}>
              <Icon
                name="user-clock"
                solid
                type="font-awesome-5"
                color={woo_gray}
                size={25}
                onPress={() => onCancelMigoRequestSubmit()}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => onfollowMigoRequestsSubmit()}>
              <Icon
                name="user-plus"
                solid
                type="font-awesome-5"
                color={woo_gray}
                size={25}
                onPress={() => onfollowMigoRequestsSubmit()}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("MessagesTab", {
                screen: "Messages",
                initial: false,
                params: { user: user },
              })
            }
          >
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
                  <ListViewGallery gallery={gallery} view={"grid"} />
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
