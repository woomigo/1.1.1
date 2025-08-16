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
import {
  woo_black,
  woo_gray,
  woo_medium_gray,
  woo_orange,
  woo_white,
} from "../assets/colors";
import { Drawer } from "react-native-drawer-layout";
import MenuScreen from "./MenuScreen";
import ListViewWoos from "./ListViewWoos";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import MapView, { Marker } from "react-native-maps";
import {
  getFormattedTime,
  getMonthAndDay,
  getTimeAgo,
  hexToRgba,
  truncUsername,
} from "./utility";
import MigosAvatarGroup from "./MigosAvatarGroup";
import WooListItems from "./WooListItems";
import GalleryPreviewGroup from "./GalleryPreviewGroup";

const WooScreen = ({ navigation, route }) => {
  const { user, woo, token } = route.params;

  const localhost = "http://192.168.12.240:3000";

  const { month, day } = getMonthAndDay(woo.item.start_date);
  const wooStartTime = getFormattedTime(woo.item.start_time);
  const wooEndTime = getFormattedTime(woo.item.end_time);

  const scrollViewRef = useRef(null);

  const [migosSubs, setMigosSubs] = useState("");
  const [gallery, setGallery] = useState([]);
  const [comments, setComments] = useState([]);
  const [list, setList] = useState([]);
  const [isLiked, setIsLiked] = useState(woo.item.liked_by_me);
  const [wooLikeCount, setWooLikeCount] = useState(woo.item.like_count);

  const fetchLikeWoo = async (woo_id) => {
    try {
      const response = await fetch(`${localhost}/woo-likes/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ woo_id }),
      });

      if (!response.ok) throw new Error("Failed to like woo");

      const data = await response.json();
      setIsLiked(!isLiked);
      setWooLikeCount((prev) => prev + 1);
    } catch (error) {
      console.error("Error liking story:", error);
    }
  };

  const fetchUnLikeWoo = async (woo_id) => {
    try {
      const response = await fetch(`${localhost}/woo-likes/unlike`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ woo_id }),
      });

      if (!response.ok) throw new Error("Failed to unlike woo");

      const data = await response.json();
      setIsLiked(!isLiked);
      setWooLikeCount((prev) => prev - 1);
    } catch (error) {
      console.error("Error unliking story:", error);
    }
  };

  const addWooLike = async (wooId) => {
    console.log("ADD ", wooId);
    await fetchLikeWoo(wooId);
  };

  const removeWooLike = async (wooId) => {
    console.log("REMOVE ", wooId);
    await fetchUnLikeWoo(wooId);
  };

  const toggleIsLiked = () => {
    isLiked ? removeWooLike(woo.item.woo_id) : addWooLike(woo.item.woo_id);
    // saveNotification();
  };

  const fetchWooMigosSub = async (wooId, type, token) => {
    try {
      const res = await fetch(
        `${localhost}/${
          type === "public" ? "subscriptions" : "migos"
        }/${wooId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setMigosSubs(data);
      console.log(`WOO SUB/MIGOS ${JSON.stringify(data)}`);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to load items.");
    }
  };

  const fetchWooGallery = async (wooId, token) => {
    if (!token) throw new Error("Auth token is missing");
    if (!wooId) throw new Error("Woo ID is required");

    const res = await fetch(`${localhost}/galleries/woo/${wooId}/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ⬅️ your auth token here
      },
    });

    if (!res.ok) throw new Error("Failed to fetch Woo Gallery");

    const data = await res.json();
    console.log("GALLERY OBJECT IS ======= " + JSON.stringify(data));

    setGallery(data.gallery);

    return res.json();
  };

  const fetchWooComments = async (wooId, token) => {
    if (!token) throw new Error("Auth token is missing");
    if (!wooId) throw new Error("Woo ID is required");

    const query = new URLSearchParams({ type: "woo", id: wooId }).toString();

    const res = await fetch(`${localhost}/comments?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch Woo Comments");

    const data = await res.json();
    console.log("COMMENTS OBJECT IS ======= ", JSON.stringify(data));

    setComments(data); // assuming you're using a useState setter

    return data; // ✅ this avoids calling res.json() twice
  };

  const fetchWooList = async (wooId, token) => {
    try {
      const res = await fetch(`${localhost}/lists/${wooId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setList(data);
      console.log(`WOO LIST ITEMS ${JSON.stringify(data.items)}`);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to load items.");
    }
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

    fetchWooMigosSub(woo.item.woo_id, woo.item.type, token);
    fetchWooGallery(woo.item.woo_id, token);
    fetchWooComments(woo.item.woo_id, token);
    fetchWooList(woo.item.woo_id, token);
  }, [woo]);

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
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: woo.item.media_url }} />

            {/* Tags overlay */}
            {woo.item.tags && woo.item.tags.length > 0 && (
              <ScrollView
                horizontal
                style={styles.tagsContainer}
                showsHorizontalScrollIndicator={false}
              >
                {woo.item.tags.map((tag, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.tagPill,
                      tag.pending ? styles.pendingTag : null,
                    ]}
                  >
                    <Text style={styles.tagText}>
                      {tag.name} {tag.pending ? "(Pending)" : ""}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
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
                  <Pressable
                    style={{
                      width: 40,
                      height: 40,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPressOut={toggleIsLiked}
                  >
                    <FontAwesome6Icon
                      name="heart"
                      style={{}}
                      size={30}
                      solid={isLiked ? true : false}
                      color={isLiked ? woo_orange : woo_black}
                    />
                  </Pressable>
                  <Text style={{ marginTop: 3, fontSize: 12 }}>
                    {wooLikeCount}
                  </Text>
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
            <View style={[styles.card, { flex: 1 }]}>
              <FontAwesome6Icon
                name="clock"
                solid
                style={{}}
                size={16}
                color={woo_black}
              />
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 8,
                  justifyContent: "center",
                }}
              >
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
              onPress={() =>
                navigation.navigate("WooMigosView", {
                  migos: migosSubs,
                  uid: user.id,
                  wooType: woo.item.type,
                })
              }
            >
              <FontAwesome6Icon
                name="users"
                solid
                size={16}
                color={woo_black}
              />
              {(woo.item.sub_profile_pics &&
                woo.item.sub_profile_pics.length > 0) ||
              (woo.item.migo_profile_pics &&
                woo.item.migo_profile_pics.length > 0) ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "space-around",
                    // alignItems: "center",
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
                  name="map-location"
                  style={{}}
                  size={16}
                  color={woo_black}
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
              onPress={() =>
                navigation.navigate("WooCommentsView", { comments })
              }
            >
              <FontAwesome6Icon
                name="comments"
                solid
                style={{ marginBottom: 5 }}
                size={16}
                color={woo_black}
              />
              {comments && comments.length > 0 ? (
                <>
                  <View style={styles.commentHeaderContainer}>
                    <View style={styles.commentHeaderUserContainer}>
                      <TouchableWithoutFeedback>
                        <Avatar
                          rounded
                          size="small"
                          onPress={() => navigation.navigate("Profile")}
                          source={{
                            uri: comments[0].profile_pic_url,
                          }}
                        />
                      </TouchableWithoutFeedback>
                      <View>
                        <TouchableWithoutFeedback>
                          <Text style={styles.commentUsername}>
                            {comments[0].username}
                          </Text>
                        </TouchableWithoutFeedback>
                        <View style={styles.commentContainer}>
                          <Text style={styles.comment}>
                            {comments[0].content}
                          </Text>

                          <Text style={styles.commentTimeAgo}>
                            {getTimeAgo(comments[0].created_at)}
                          </Text>
                        </View>{" "}
                      </View>
                    </View>
                    <View style={styles.likeContainer}>
                      <TouchableOpacity style={styles.likeButton}>
                        <FontAwesome6Icon
                          name="heart"
                          size={20}
                          color={woo_black}
                        />
                        <Text style={styles.likeText}>{0}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.seeMoreCommentsContainer}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("WooCommentsView", { comments })
                      }
                    >
                      <Text style={styles.seeMoreCommentsText}>
                        {comments && comments.length > 1
                          ? `see ${
                              comments && comments.length > 1
                                ? comments.length - 1 + " "
                                : ""
                            }more comment${comments.length > 2 ? "s" : ""}...`
                          : "add a comment..."}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    margin: 20,
                  }}
                >
                  <Text>be the first to comment</Text>
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
              onPress={() =>
                navigation.navigate("MediaGallery", { media: gallery })
              }
            >
              <FontAwesome6Icon
                name="images"
                style={{ marginBottom: 5 }}
                solid
                size={16}
                color={woo_black}
              />
              {gallery && gallery.length > 0 ? (
                <GalleryPreviewGroup gallery={gallery} alignRow="flex-start" />
              ) : (
                // <LayoutWooGallery gallery={gallery} />
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    margin: 20,
                  }}
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
              onPress={() =>
                navigation.navigate("WooList", { items: list.items })
              }
            >
              <FontAwesome6Icon
                name="list-check"
                solid
                size={16}
                color={woo_black}
              />
              {list.items && list.items.length > 0 ? (
                <WooListItems user items={list.items} token showPreviewOnly />
              ) : (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    margin: 20,
                  }}
                >
                  <Text>all we need is you!</Text>
                </View>
              )}
            </Pressable>
          </View>

          {/* Bottom Sheets */}

          {/* <DraggableBottomSheet
            // profilePicURL={profilePicURL}
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
          ></DraggableBottomSheet> */}
          {/* 
          <DraggableBottomSheet
            // profilePicURL={profilePicURL}
            title={"migos"}
            isVisible={isWooMigosBottomSheetVisible}
            onClose={() => setIsWooMigosBottomSheetVisible(false)}
          >
            <Text style={styles.sheetTitle}>Draggable Content</Text>
            <Text style={styles.sheetText}>
              You can drag this sheet up or down!
            </Text>
          </DraggableBottomSheet> */}
          {/* 
          <DraggableBottomSheet
            // profilePicURL={profilePicURL}
            title={"gallery"}
            isVisible={isWooGalleryBottomSheetVisible}
            onClose={() => setIsWooGalleryBottomSheetVisible(false)}
          >
            <Text style={styles.sheetTitle}>Draggable Content</Text>
            <Text style={styles.sheetText}>
              You can drag this sheet up or down!
            </Text>
          </DraggableBottomSheet> */}

          {/* <DraggableBottomSheet
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
  imageContainer: {
    position: "relative",
    height: 600,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  tagsContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    height: 40,
  },
  tagPill: {
    backgroundColor: hexToRgba(woo_gray, 0.7), // blue with 70% opacity
    paddingHorizontal: 20,

    borderRadius: 20,
    marginRight: 8,
    justifyContent: "center",
  },

  pendingTag: {
    backgroundColor: "#FF9500",
  },
  tagText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  card: {
    backgroundColor: woo_medium_gray,
    padding: 10,
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
    flexDirection: "row",
    marginStart: 15,
  },
  commentHeaderUserContainer: {
    flexDirection: "row",
    flex: 5,
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
  likeContainer: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",
  },
  likeButton: {
    justifyContent: "center",
    alignItems: "center",
  },

  likeText: {
    marginStart: 3,
    fontSize: 10,
  },
});

export default WooScreen;
