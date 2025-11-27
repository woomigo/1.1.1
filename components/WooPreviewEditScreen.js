import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  Pressable,
  TouchableWithoutFeedback,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import {
  woo_black,
  woo_gray,
  woo_medium_gray,
  woo_orange,
  woo_white,
} from "../assets/colors";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import MapView, { Marker } from "react-native-maps";
import { getMonthAndDay, getTimeAgo, hexToRgba } from "./utility";
import Avatar from "./Avatar";
import MigosAvatarGroup from "./MigosAvatarGroup";
import WooListItems from "./WooListItems";

const WooPreviewEditScreen = ({ navigation, route }) => {
  const {
    wooMedia,
    wooType,
    wooMigos,
    wooTags,
    wooDate,
    wooTime,
    wooLocation,
    wooList,
    user,
    token,
  } = route.params;

  const { month, day } = getMonthAndDay(wooDate);

  const [wooLikes, setWooLikes] = useState([]);
  const [wooComments, setWooComments] = useState([]);
  const [wooGallery, setWooGallery] = useState([]);
  const [username, setUsername] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [profilePicURL, setProfilePicURL] = useState();
  const [timeAgo, setTImeAgo] = useState("");

  useEffect(() => {
    // console.log(" WPES WOODATE " + JSON.stringify(wooDate));

    // setMonth(({ month } = getMonthAndDay(wooDate)));
    // setDay(({ day } = getMonthAndDay(wooDate)));
  }, [wooDate]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={"position"} style={{ marginBottom: 70 }}>
        <ScrollView scrollEventThrottle={16}>
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
              {wooType === "public" ? (
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
            <Image style={styles.image} source={{ uri: wooMedia.uri }} />

            {/* Tags overlay */}
            {wooTags && wooTags.length > 0 && (
              <ScrollView
                horizontal
                style={styles.tagsContainer}
                showsHorizontalScrollIndicator={false}
              >
                {wooTags.map((tag, idx) => (
                  <View key={idx} style={[styles.tagPill]}>
                    <Text style={styles.tagText}>{tag}</Text>
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
                  size={40}
                  name={firstName + " " + lastName}
                  onPress={() => navigation.navigate("Profile")}
                  image={user.profile_pic_url}
                />
                <View style={{ marginStart: 5 }}>
                  <Text>{user.first_name}</Text>
                  <Text>{user.last_name}</Text>
                  <Text style={{ fontSize: 12 }}>@{user.username}</Text>
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
                  >
                    <FontAwesome6Icon
                      name="heart"
                      style={{}}
                      size={30}
                      solid={false}
                      color={woo_black}
                    />
                  </Pressable>
                  <Text style={{ marginTop: 3, fontSize: 12 }}>{0}</Text>
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
                  <Text>{wooTime}</Text>
                </View>
              </View>
            </View>

            <Pressable
              style={[styles.card, { flex: 1, marginStart: 5 }]}
              onPress={() =>
                navigation.navigate("WooMigosView", {
                  migos: wooMigos,
                  uid: user.id,
                  wooType: wooType,
                })
              }
            >
              <FontAwesome6Icon
                name="users"
                solid
                size={16}
                color={woo_black}
              />
              {wooType === "private" ? (
                <View style={{ flex: 1, marginStart: 5 }}>
                  <View style={styles.avatarRow}>
                    {wooMigos &&
                      wooMigos.slice(0, 5).map((user, index) => (
                        <View
                          key={user.id}
                          style={[
                            styles.avatarWrapper,
                            index !== 0 && styles.overlap,
                          ]}
                        >
                          <Avatar
                            name={user.first_name + " " + user.last_name}
                            image={user.profile_pic_url}
                            size={36}
                          />
                        </View>
                      ))}

                    {wooMigos && wooMigos.length > 5 && (
                      <View style={[styles.avatarWrapper, styles.overlap]}>
                        <View style={styles.extraAvatar}>
                          <Text style={styles.extraText}>
                            +{wooMigos.length - 5}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              ) : (
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Text>no subs</Text>
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
                <Text style={styles.infoText}> {wooLocation.address}</Text>
              </View>

              <MapView
                style={styles.map}
                region={wooLocation.region}
                initialRegion={wooLocation.region}
                scrollEnabled={false}
                zoomEnabled={false} // Disables pinch-to-zoom
                pitchEnabled={false} // Disables 3D tilt gestures
                rotateEnabled={false} // Disables map rotation
              >
                <Marker
                  coordinate={wooLocation.region}
                  title={wooLocation.address}
                />
              </MapView>
            </View>
          </View>
          {/* Fourth
                Row */}

          {/* <View
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
          </View> */}

          {/* Fifth
                Row */}
          {/* <View
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
          </View> */}

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
              onPress={() => navigation.navigate("WooList", { items: wooList })}
            >
              <FontAwesome6Icon
                name="list-check"
                solid
                size={16}
                color={woo_black}
              />
              {wooList && wooList.length > 0 ? (
                <WooListItems user items={wooList} token showPreviewOnly />
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
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.createWooButton}
          // onPress={handleCreateWoo} // Function to create chat/group
        >
          <Text style={styles.createWooText}>create woo</Text>
        </TouchableOpacity>
      </View>
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
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderRadius: 10,
  },
  avatarWrapper: {},
  overlap: {
    marginLeft: -20,
  },
  extraAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  extraText: {
    fontWeight: "600",
    color: "#333",
    fontSize: 12,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 5, // Distance from the bottom of the screen
    left: 16,
    right: 16, // Optional: keep it aligned to left and right edges
    marginBottom: 5, // Adds space from bottom of the screen
  },

  createWooButton: {
    backgroundColor: woo_orange,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  createWooText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WooPreviewEditScreen;
