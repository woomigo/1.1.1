import { useEffect, useRef, useState } from "react";
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
  KeyboardAvoidingView,
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
import DraggableBottomSheet from "./DraggableBottomSheet";
import ListViewComments from "./ListViewComments";

const MediaViewScreen = ({ navigation, route }) => {
  const { mediaObject, media } = route.params;

  //   const { month, day } = getMonthAndDay(wooDate);

  const scrollViewRef = useRef(null);

  const [username, setUsername] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [profilePicURL, setProfilePicURL] = useState();
  const [timeAgo, setTImeAgo] = useState("");
  const [isCommentBottomSheetVisible, setIsCommentBottomSheetVisible] =
    useState(false);

  const handleOpenCommentBottomSheet = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true }); // Scroll to bottom
    setIsCommentBottomSheetVisible(true);
  };

  useEffect(() => {
    // const docRef = doc(db, "users", ownerUID);
    // const getMediaOwnerProfileInfo = onSnapshot(
    //   docRef,
    //   (doc) => {
    //     console.log("Document data:", doc.data());
    //     setUser(doc.data());
    //     setUsername(truncUsername(doc.data().username));
    //     setFirstName(doc.data().first_name);
    //     setLastName(doc.data().last_name);
    //     setProfilePicURL(doc.data().profile_pic_url);
    //     // setTImeAgo(getTimeAgo(wooMediaComments[0].timestamp.seconds));
    //   },
    //   (error) => {},
    //   []
    // );

    // return () => {
    //     getMediaOwnerProfileInfo();
    // };
    console.log("MEDIA VIEW " + JSON.stringify(media.media_url));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={"position"}
        // style={styles.topButtonsContainer}
      >
        <ScrollView ref={scrollViewRef} scrollEventThrottle={16}>
          <View style={styles.topButtonsContainer}>
            <View style={styles.topButtons}>
              <View style={styles.topButtonBackground}>
                <FontAwesome6Icon
                  name="angle-left"
                  style={{}}
                  size={30}
                  color={woo_white}
                  onPress={() => navigation.goBack()}
                />
              </View>
            </View>
          </View>
          <Image style={styles.image} source={{ uri: media.media_url }} />
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
              style={[styles.card, { flex: 2.5, justifyContent: "center" }]}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Avatar
                  rounded
                  size="medium"
                  backgroundColor={woo_white}
                  onPress={() => navigation.navigate("Profile")}
                  source={{
                    uri: "https://images.unsplash.com/photo-1491349174775-aaafddd81942?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=634&q=80",
                  }}
                />
                <View style={{ marginStart: 5 }}>
                  <Text>first name</Text>
                  <Text>last name</Text>
                  <Text style={{ fontSize: 12 }}>@username</Text>
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
                  />
                  <Text style={{ marginTop: 3 }}>0</Text>
                </View>
                <View>
                  <FontAwesome6Icon
                    name="paper-plane"
                    style={{}}
                    size={30}
                    color={woo_black}
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
                  <Text style={styles.dateText}>jun</Text>
                  <Text style={styles.dateText}>19</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Second 
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
            <Pressable
              style={[styles.card, { flex: 1 }]}
              onPress={() => handleOpenCommentBottomSheet()}
            >
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
                      <Text style={styles.commentUsername}>
                        {"boston_girl"}
                      </Text>
                    </TouchableWithoutFeedback>
                    <View style={styles.commentContainer}>
                      <Text style={styles.comment}>
                        {/* {wooComments[0].comment} */}
                        this is a comment
                      </Text>

                      <Text style={styles.commentTimeAgo}>4 secs ago</Text>
                    </View>{" "}
                  </View>
                </View>
              </View>
              <View style={styles.seeMoreCommentsContainer}>
                <TouchableOpacity
                  onPress={() => handleOpenCommentBottomSheet()}
                >
                  <Text style={styles.seeMoreCommentsText}>
                    {/* {`see ${wooComments.length - 1} more comments...`} */}
                    see 5 more coments...
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </View>

          {/* Bottom Sheets */}

          <DraggableBottomSheet
            profilePicURL={profilePicURL}
            title={"comments"}
            isVisible={isCommentBottomSheetVisible}
            onClose={() => setIsCommentBottomSheetVisible(false)}
            showInput
            placeholderText={"add a comment..."}
            isFlatlist
            // flatlistData={wooComments}
            renderData={(comment) => (
              <LayoutCommentItem uid={uid} comment={comment} />
            )}
          ></DraggableBottomSheet>
        </ScrollView>
      </KeyboardAvoidingView>
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
    height: 600,
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

export default MediaViewScreen;
