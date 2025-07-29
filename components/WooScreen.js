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
  TouchableWithoutFeedback,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { Avatar, Tab, TabView, Card, Button } from "@rneui/themed";
import ListViewGallery from "./ListViewGallery";
import { woo_black, woo_orange, woo_white } from "../assets/colors";
import { Drawer } from "react-native-drawer-layout";
import MenuScreen from "./MenuScreen";
import ListViewWoos from "./ListViewWoos";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import MapView, { Marker } from "react-native-maps";
import {
  getFormattedTime,
  getMonthAndDay,
  getTimeAgo,
  truncUsername,
} from "./utility";
import LayoutWooGallery from "./LayoutWooGallery";
import DraggableBottomSheet from "./DraggableBottomSheet";
import ListViewComments from "./ListViewComments";
import ListViewWooList from "./ListViewWooList";
import MigosAvatarGroup from "./MigosAvatarGroup";

const WooScreen = ({ navigation, route }) => {
  const { uid, woo, token } = route.params;

  const localhost = "http://192.168.12.240:3000";

  const { month, day } = getMonthAndDay(woo.item.start_date);
  const wooStartTime = getFormattedTime(woo.item.start_time);
  const wooEndTime = getFormattedTime(woo.item.end_time);

  const scrollViewRef = useRef(null);

  const [timeAgo, setTImeAgo] = useState("");
  const [isCommentBottomSheetVisible, setIsCommentBottomSheetVisible] =
    useState(false);
  const [isWooMigosBottomSheetVisible, setIsWooMigosBottomSheetVisible] =
    useState(false);
  const [isWooGalleryBottomSheetVisible, setIsWooGalleryBottomSheetVisible] =
    useState(false);
  const [isWooListBottomSheetVisible, setIsWooListBottomSheetVisible] =
    useState(false);

  const handleOpenCommentBottomSheet = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true }); // Scroll to bottom
    setIsCommentBottomSheetVisible(true);
  };

  const handleOpenWooMigosBottomSheet = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true }); // Scroll to bottom
    setIsWooMigosBottomSheetVisible(true);
  };

  const handleOpenWooGalleryBottomSheet = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true }); // Scroll to bottom
    setIsWooGalleryBottomSheetVisible(true);
  };

  const handleOpenWooListBottomSheet = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true }); // Scroll to bottom
    setIsWooListBottomSheetVisible(true);
  };

  const subscribeToWoo = () => {
    console.log("SUBSCRIBED!!!");
  };

  useEffect(() => {
    if (woo.item.type === "private") {
      // CODE FOR MARKING PRIVATE WOO SEEN
      markPrivateWooSeen();
    }
    console.log("WOOOOOO " + JSON.stringify(woo));
  });

  const markPrivateWooSeen = async () => {
    await fetch(`${localhost}/woos/${woo.item.woo_id}/seen`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  };

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
              {woo.item.type === "public" ? (
                <View style={styles.topButtonBackground}>
                  <FontAwesome6Icon
                    name="bookmark"
                    style={{}}
                    size={30}
                    color={woo_white}
                    onPress={() => subscribeToWoo()}
                  />
                </View>
              ) : null}
            </View>
          </View>
          <Image style={styles.image} source={{ uri: woo.item.media_url }} />
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
                  onPress={() =>
                    navigation.navigate("Profile", {
                      userUID: woo.item.user_id,
                    })
                  }
                  source={{ uri: woo.item.profile_pic_url }}
                />
                <View style={{ marginStart: 5 }}>
                  <Text>{woo.item.first_name}</Text>
                  <Text>{woo.item.last_name}</Text>
                  <Text style={{ fontSize: 12 }}>@{woo.item.username}</Text>
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
                    solid={woo.item.liked_by_me ? true : false}
                    color={woo.item.liked_by_me ? woo_orange : woo_black}
                    onPress={() => setIsPrivateVisible(!isPrivateVisible)}
                  />
                  <Text style={{ marginTop: 3, fontSize: 12 }}>
                    {woo.item.like_count}
                  </Text>
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
                  <Text>
                    {woo.item.start_time &&
                      `${wooStartTime} ${
                        woo.item.end_time == null ? "" : "- " + wooEndTime
                      }`}
                  </Text>
                </View>
              </View>
            </View>

            <Pressable
              style={[styles.card, { flex: 1, marginStart: 5 }]}
              onPress={() => handleOpenWooMigosBottomSheet()}
            >
              {(woo.item.sub_profile_pics &&
                woo.item.sub_profile_pics.length > 0) ||
              (woo.item.migo_profile_pics &&
                woo.item.migo_profile_pics.length > 0) ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <MigosAvatarGroup
                    alignRow="center"
                    migos={
                      woo.item.type == "public"
                        ? woo.item.sub_profile_pics
                        : woo.item.migo_profile_pics
                    }
                  />
                </View>
              ) : (
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Text>no {woo.item.type == "public" ? "subs" : "migos"}</Text>
                </View>
              )}
            </Pressable>
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
                <Text style={styles.infoText}>
                  {" "}
                  {woo.item.location.address}
                </Text>
              </View>

              <MapView
                style={styles.map}
                region={woo.item.location.region}
                initialRegion={woo.item.location.region}
                scrollEnabled={false}
                zoomEnabled={false} // Disables pinch-to-zoom
                pitchEnabled={false} // Disables 3D tilt gestures
                rotateEnabled={false} // Disables map rotation
              >
                <Marker
                  coordinate={woo.item.location.region}
                  title={woo.item.location.address}
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
            <Pressable
              style={[styles.card, { flex: 1 }]}
              onPress={() => handleOpenCommentBottomSheet()}
            >
              {woo.item.woo_comments && woo.item.woo_comments.length > 0 ? (
                <>
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
                            {woo.item.woo_comments[0].comment}
                          </Text>

                          <Text style={styles.commentTimeAgo}>{timeAgo}</Text>
                        </View>{" "}
                      </View>
                    </View>
                  </View>
                  <View style={styles.seeMoreCommentsContainer}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("CommentsComponent", {
                          wooID: wooID,
                        })
                      }
                    >
                      <Text style={styles.seeMoreCommentsText}>
                        {`see ${
                          woo.item.woo_comments &&
                          woo.item.woo_comments.length - 1
                        } more comments...`}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Text>no comments</Text>
                </View>
              )}
            </Pressable>
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
            <Pressable
              style={[styles.card, { flex: 1 }]}
              onPress={() => handleOpenWooGalleryBottomSheet()}
            >
              {woo.item.woo_gallery && woo.item.woo_gallery.length > 0 ? (
                <LayoutWooGallery gallery={woo.item.woo_gallery} />
              ) : (
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Text>no gallery</Text>
                </View>
              )}
            </Pressable>
          </View>

          {/* Sixth
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
              onPress={() => handleOpenWooListBottomSheet()}
            >
              {woo.item.woo_list && woo.item.woo_list.length > 0 ? (
                <ListViewWooList
                  view={"horizontal"}
                  wooList={woo.item.woo_list}
                  size="xl"
                />
              ) : (
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Text>no list</Text>
                </View>
              )}
            </Pressable>
          </View>

          {/* Bottom Sheets */}

          {/* <DraggableBottomSheet
            profilePicURL={profilePicURL}
            title={"comments"}
            isVisible={isCommentBottomSheetVisible}
            onClose={() => setIsCommentBottomSheetVisible(false)}
            showInput
            placeholderText={"add a comment..."}
            isFlatlist
            flatlistData={wooComments}
            renderData={(comment) => (
              <LayoutCommentItem uid={uid} comment={comment} />
            )}
          ></DraggableBottomSheet>

          <DraggableBottomSheet
            profilePicURL={profilePicURL}
            title={"migos"}
            isVisible={isWooMigosBottomSheetVisible}
            onClose={() => setIsWooMigosBottomSheetVisible(false)}
          >
            <Text style={styles.sheetTitle}>Draggable Content</Text>
            <Text style={styles.sheetText}>
              You can drag this sheet up or down!
            </Text>
          </DraggableBottomSheet>

          <DraggableBottomSheet
            profilePicURL={profilePicURL}
            title={"gallery"}
            isVisible={isWooGalleryBottomSheetVisible}
            onClose={() => setIsWooGalleryBottomSheetVisible(false)}
          >
            <Text style={styles.sheetTitle}>Draggable Content</Text>
            <Text style={styles.sheetText}>
              You can drag this sheet up or down!
            </Text>
          </DraggableBottomSheet>

          <DraggableBottomSheet
            profilePicURL={profilePicURL}
            title={"list"}
            isVisible={isWooListBottomSheetVisible}
            onClose={() => setIsWooListBottomSheetVisible(false)}
          >
            <ListViewWooList view={"grid"} wooList={wooList} size="xl" />
          </DraggableBottomSheet> */}
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
