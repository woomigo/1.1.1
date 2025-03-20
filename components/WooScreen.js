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
  TouchableWithoutFeedback,
  TouchableOpacity,
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
import MapView, { Marker } from "react-native-maps";
import { getMonthAndDay, getTimeAgo, truncUsername } from "./utility";
import LayoutWooGallery from "./LayoutWooGallery";

const WooScreen = ({ navigation, route }) => {
  const {
    wooID,
    wooDate,
    image,
    wooLikes,
    wooMigos,
    wooType,
    uid,
    ownerUID,
    wooTime,
    wooLocation,
    wooComments,
    wooGallery
  } = route.params;

  const { month, day } = getMonthAndDay(wooDate);

  const [user, setUser] = useState();
  const [username, setUsername] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [profilePicURL, setProfilePicURL] = useState();
  const [timeAgo, setTImeAgo] = useState("");

  useEffect(() => {
    setTImeAgo(getTimeAgo(wooComments[0].timestamp.seconds));
    const docRef = doc(db, "users", ownerUID);
    const getWooOwnerProfileInfo = onSnapshot(
      docRef,
      (doc) => {
        console.log("Document data:", doc.data());
        setUser(doc.data());
        setUsername(truncUsername(doc.data().username));
        setFirstName(doc.data().first_name);
        setLastName(doc.data().last_name);
        setProfilePicURL(doc.data().profile_pic_url);
      },
      (error) => {},
      []
    );

    return () => {
      getWooOwnerProfileInfo();
    };
  }, [ownerUID]);

  const WooMigoImage = ({ userID }) => {
    const [profilePicURL, setProfilePicURL] = useState();

    useEffect(() => {
      const docRef = doc(db, "users", userID);
      const getProfileInfo = onSnapshot(
        docRef,
        (doc) => {
          // console.log("Document data:", doc.data());
          setProfilePicURL(doc.data().profile_pic_url);
        },
        (error) => {}
      );

      return () => {
        getProfileInfo();
      };
    }, []);

    return (
      <Image style={styles.wooMigoImage} source={{ uri: profilePicURL }} />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image style={styles.image} source={{ uri: image }} />
        {/* FIRST 
        ROW */}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            marginHorizontal: 10,
            marginVertical: 5,
          }}
        >
          <View
            style={[
              styles.card,
              { flex: 2.5, alignItems: "center", justifyContent: "center" },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Avatar
                rounded
                size="medium"
                onPress={() => navigation.navigate("Profile")}
                source={{ uri: profilePicURL }}
              />
              <View style={{ marginStart: 5 }}>
                <Text>{firstName}</Text>
                <Text>{lastName}</Text>
                <Text style={{ fontSize: 12 }}>@{username}</Text>
              </View>
            </View>
          </View>
          <View
            style={[
              styles.card,
              { flex: 1, marginStart: 5, justifyContent: "center" },
            ]}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <FontAwesome6Icon
                  name="heart"
                  style={{}}
                  size={30}
                  color={woo_black}
                  onPress={() => setIsPrivateVisible(!isPrivateVisible)}
                />
                <Text style={{ marginTop: 3 }}>{wooLikes.length}</Text>
              </View>
              <View>
                <FontAwesome6Icon
                  name="paper-plane"
                  style={{}}
                  size={30}
                  color={woo_black}
                  onPress={() => setIsPrivateVisible(!isPrivateVisible)}
                />
                <Text style={{ marginTop: 3 }}>{}</Text>
              </View>
            </View>
          </View>
          <View
            style={[
              styles.card,
              {
                flex: 1,
                marginStart: 5,
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <View
              style={{
                flex: 1,
                // flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                // backgroundColor: "orange",
              }}
            >
              <View style={styles.date}>
                <Text style={styles.dateText}>{month}</Text>
                <Text style={styles.dateText}>{day}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* SECOND 
        ROW */}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            marginHorizontal: 10,
            marginBottom: 5,
            marginTop: 0,
          }}
        >
          <View
            style={[
              styles.card,
              { flex: 1, alignItems: "center", justifyContent: "center" },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesome6Icon
                name="clock"
                style={{}}
                size={16}
                color={woo_black}
                onPress={() => setIsPrivateVisible(!isPrivateVisible)}
              />
              <View style={{ marginStart: 5 }}>
                <Text>{wooTime}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.card, { flex: 1, marginStart: 5 }]}>
            <View
              style={{
                flex: 1,
                // flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                // backgroundColor: "orange",
              }}
            >
              <View style={styles.wooMigosImagesContainer}>
                {wooMigos.length > 0 && <WooMigoImage userID={wooMigos[0]} />}
                {wooMigos.length > 1 && <WooMigoImage userID={wooMigos[1]} />}
                {wooMigos.length > 2 && <WooMigoImage userID={wooMigos[2]} />}
                {wooMigos.length > 3 && <WooMigoImage userID={wooMigos[3]} />}
                {wooMigos.length > 4 && (
                  <View
                    style={[
                      styles.wooMigoImage,
                      {
                        backgroundColor: woo_orange,
                        justifyContent: "center",
                        alignItems: "center",
                      },
                    ]}
                  >
                    <Text style={{ color: woo_white, fontSize: 12 }}>
                      +{wooMigos.length - 4}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
        {/* Third 
                Row */}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            marginHorizontal: 10,
            marginBottom: 5,
            marginTop: 0,
          }}
        >
          <View style={[styles.card, { flex: 1 }]}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome6Icon
                name="location-dot"
                style={{}}
                size={16}
                color={woo_black}
                onPress={() => setIsPrivateVisible(!isPrivateVisible)}
              />
              <Text style={styles.infoText}> {wooLocation}</Text>
            </View>

            <MapView
              style={styles.map}
              initialRegion={{
                latitude: 40.7128,
                longitude: -74.006,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{ latitude: 40.7128, longitude: -74.006 }}
                title={wooLocation}
              />
            </MapView>
          </View>
        </View>
        {/* Fourth
                Row */}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            marginHorizontal: 10,
            marginBottom: 5,
            marginTop: 0,
          }}
        >
          <View style={[styles.card, { flex: 1 }]}>
            <View style={styles.commentHeaderContainer}>
              <View style={styles.commentHeaderUserContainer}>
                <TouchableWithoutFeedback>
                  <Avatar
                    rounded
                    size="small"
                    onPress={() => navigation.navigate("Profile")}
                    source={{
                      uri: "https://images.unsplash.com/photo-1491349174775-aaafddd81942?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=634&q=80",
                    }}
                  />
                </TouchableWithoutFeedback>
                <View>
                  <TouchableWithoutFeedback>
                    <Text style={styles.commentUsername}>{"boston_girl"}</Text>
                  </TouchableWithoutFeedback>
                  <View style={styles.commentContainer}>
                    <Text style={styles.comment}>{wooComments[0].comment}</Text>

                    <Text style={styles.commentTimeAgo}>{timeAgo}</Text>
                  </View>{" "}
                </View>
              </View>
            </View>
            <View style={styles.seeMoreCommentsContainer}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("CommentsComponent", { wooID: wooID })
                }
              >
                <Text style={styles.seeMoreCommentsText}>
                  {`see ${wooComments.length - 1} more comments...`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>


                {/* Fifth
                Row */}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            marginHorizontal: 10,
            marginBottom: 5,
            marginTop: 0,
          }}
        >
          <View style={[styles.card, { flex: 1 }]}>
           <LayoutWooGallery gallery={wooGallery} nav={'WooGalleryView'}/>
          </View>
        </View>
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
  card: {
    backgroundColor: "#1e1e1e25",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    // marginBottom: 15,
  },
  date: {
    flex: 1,
    padding: 20,
    backgroundColor: woo_orange,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    color: woo_white,
  },
  wooMigosImagesContainer: {
    flexDirection: "row",
  },
  wooMigoImage: {
    backgroundColor: "#1e1e1e",
    width: 35,
    height: 35,
    borderRadius: 18,
    marginEnd: -10,
  },
  infoText: {
    fontSize: 14,
  },
  map: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  commentHeaderContainer: {
    // flexDirection: "row",
    marginStart: 5,
    marginEnd: 5,
    // backgroundColor: "blue",
  },
  commentHeaderUserContainer: {
    flexDirection: "row",
    // alignItems: "center",
    marginStart: 5,
  },
  commentUserImage: {
    width: 25,
    height: 25,
    borderRadius: 25,
    marginStart: 5,
  },
  commentUsername: {
    marginStart: 5,
    fontWeight: "bold",
    fontSize: 14,
  },
  commentContainer: {
    // backgroundColor: "blue",
  },
  commentTimeContainer: {
    marginEnd: 5,
  },
  commentTimeAgo: {
    justifyContent: "flex-end",
    marginStart: 5,
    marginTop: 3,
    fontSize: 8,
  },
  comment: {
    marginStart: 5,
    fontSize: 12,
  },
  seeMoreCommentsContainer: {
    marginStart: 50,
    marginTop: 10,
  },
  seeMoreCommentsText: {
    textDecorationLine: "underline",
    fontSize: 12,
  },
});

export default WooScreen;
