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
import { Tab, TabView, Card, Button } from "@rneui/themed";
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
import Avatar from "./Avatar";
import ListViewWooList from "./ListViewWooList";

const WooPreviewEditScreen = ({ navigation, route }) => {
  const {
    wooMedia,
    wooType,
    wooMigos,
    migoWoos,
    // username,
    // profilePicURL,
    // firstName,
    // lastName,
    wooDate,
    wooTime,
    wooLocation,
    wooList,
    uid,
  } = route.params;
  //   const {
  //     wooID,
  //     wooDate,
  //     image,
  //     wooLikes,
  //     wooMigos,
  //     wooType,
  //     uid,
  //     ownerUID,
  //     wooTime,
  //     wooLocation,
  //     wooComments,
  //     wooGallery
  //   } = route.params;

  const { month, day } = getMonthAndDay(wooDate);

  const [user, setUser] = useState();
  const [wooLikes, setWooLikes] = useState([]);
  const [wooComments, setWooComments] = useState([]);
  const [wooGallery, setWooGallery] = useState([]);
  const [username, setUsername] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [profilePicURL, setProfilePicURL] = useState();
  const [timeAgo, setTImeAgo] = useState("");

  useEffect(() => {
    console.log(" WOOMIGOS " + JSON.stringify(wooMigos));
    // setTImeAgo(wooComments.length > 0 && getTimeAgo(wooComments[0].timestamp.seconds));
    const docRef = doc(db, "users", uid);
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
  }, [uid]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{marginBottom: 60}}>
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
            <View></View>
          </View>
        </View>
        <Image style={styles.image} source={{ uri: wooMedia.uri }} />
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
              { flex: 2, justifyContent: "center", marginEnd: 5 },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                // backgroundColor: 'red'
              }}
            >
              <Avatar
                size={40}
                name={firstName + " " + lastName}
                onPress={() => navigation.navigate("Profile")}
                image={profilePicURL}
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
                      name={user.name}
                      image={user.profilePicUrl}
                      size={36}
                    />
                  </View>
                ))}

              {wooMigos && wooMigos.length > 5 && (
                <View style={[styles.avatarWrapper, styles.overlap]}>
                  <View style={styles.extraAvatar}>
                    <Text style={styles.extraText}>+{wooMigos.length - 5}</Text>
                  </View>
                </View>
              )}
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
              <Text style={styles.infoText}> {wooLocation.address}</Text>
            </View>

            <MapView
              style={styles.map}
              scrollEnabled={false}
              zoomEnabled={false} // Disables pinch-to-zoom
              pitchEnabled={false} // Disables 3D tilt gestures
              rotateEnabled={false} // Disables map rotation
              region={wooLocation.region}
              initialRegion={wooLocation.region}
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
                    <Text style={styles.comment}>{wooComments.length > 0 && wooComments[0].comment}</Text>

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
        </View> */}

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
            {/* <LayoutWooGallery gallery={wooGallery} nav={'WooGalleryView'}/> */}
          </View>
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
              <ListViewWooList
                view={"preview"}
                wooList={wooList}
                size="xl"
              />
            </Pressable>
          </View>
      </ScrollView>
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
  image: {
    backgroundColor: "#d9d9d9",
    height: 600,
  },
  card: {
    backgroundColor: "#1e1e1e25",
    padding: 5,
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
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: woo_white,
    padding: 5,
    borderRadius: 10,
  },
  avatarWrapper: {
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 36,
  },
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

// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView } from "react-native";
// import { Header, Icon, LinearProgress, Dialog } from "@rneui/themed";
// import { woo_black, woo_orange, woo_white } from '../assets/colors';
// import LayoutWooImage from './LayoutWooImage';
// import LayoutWooInfo from './LayoutWooInfo';
// import LayoutWooLike from './LayoutWooLike';
// import LayoutWooLocation from './LayoutWooLocation';
// import LayoutWooList from './LayoutWooList';
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import { db, storage } from '../firebaseConfig';
// import { addDoc, collection, } from 'firebase/firestore';

// const WooPreviewEditScreen = ({ route, navigation }) => {

//     const [imageStorageProgress, setImageStorageProgress] = useState(0)
//     const [loading, setLoading] = useState(false);
//     const [wooLikes, setWooLikes] = useState([]);

//     const { wooMedia, wooType, wooMigos, migoWoos, username, profilePicURL, wooDate, wooTime, wooLocation, wooList, uid } = route.params;

//     useEffect(() => {
//         console.log(`WOOMEDIA AT PREVIEW WOO ==== ${wooMedia.uri}`)
//     }, [wooMedia])

//     const uploadImage = async (uri, fileType) => {
//         const res = await fetch(uri);
//         if (res.ok) {
//             const blobImage = await res.blob()

//             const storageRef = ref(storage, "wooMedia/" + uid + new Date().getTime())

//             const uploadTask = uploadBytesResumable(storageRef, blobImage)

//             uploadTask.on('state_changed',
//                 (snapshot) => {
//                     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
//                     setImageStorageProgress(progress.toFixed())
//                 },
//                 (error) => {
//                     console.error(`UPLOAD IMAGE TO STORAGE ERROR === ${error}`)
//                 },
//                 () => {
//                     getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
//                         console.log(url)
//                         saveMedia(url, wooType, wooMigos, migoWoos, wooDate, wooTime, wooLocation, wooList, new Date().getTime(), uid)
//                     })
//                 }
//             )
//         }
//     }

//     const saveMedia = async (woo_media_url, woo_type, woo_migos, migo_woos, woo_date, woo_time, woo_location, woo_list, created_at, owner_uid) => {
//         try {
//             const docRef = await addDoc(collection(db, "woos"), {
//                 woo_media_url, woo_type, woo_migos, migo_woos, woo_date, woo_time, woo_location, woo_list, created_at, owner_uid, woo_comments: [], woo_gallery: [], woo_likes: []
//             })
//             console.log("MEDIA SAVED TO DB ", docRef.id)
//             setLoading(false)
//             navigation.popToTop();
//             navigation.navigate('Profile')
//         } catch (error) {
//             console.error(error)
//         }
//     }

//     const navigateToProfileAndClearStack = async () => {
//         setLoading(true)
//         await uploadImage(wooMedia.uri, 'image')
//     }

//     useEffect(() => {
//         console.log(wooLocation)
//     })

//     return (
//         <View style={styles.container}>

//             <Dialog isVisible={loading}>
//             <Dialog.Title title="uploading woo" titleStyle={{textAlign: 'center'}} />

//                 <Dialog.Loading />
//             </Dialog>

//             <Header
//                 style={styles.header}
//                 backgroundColor={'#fff'}
//                 leftComponent={
//                     <Icon
//                         name="chevron-left"
//                         type='font-awesome-5'
//                         color={woo_black}
//                         size={25}
//                         onPress={() =>
//                             navigation.navigate('WooList', { wooMedia: wooMedia, wooType: wooType, wooMigos: wooMigos, migoWoos: migoWoos, username: username, profilePicURL: profilePicURL, wooDate: wooDate, wooTime: wooTime, wooLocation: wooLocation, wooList: wooList, migoWoos: migoWoos })
//                         }
//                     />}
//                 centerComponent={
//                     <View >
//                         <Text style={{ fontSize: 25, color: woo_black, textAlign: 'center', fontWeight: 'bold' }}>woo preview & edit</Text>
//                     </View>
//                 }
//                 rightComponent={
//                     <Icon
//                         name="chevron-right"
//                         type='font-awesome-5'
//                         color={woo_black}
//                         size={25}
//                         onPress={() =>
//                             navigateToProfileAndClearStack()
//                         }
//                     />
//                 }
//                 rightContainerStyle={styles.rightComponent}
//                 leftContainerStyle={styles.leftComponent}
//                 centerContainerStyle={styles.centerComponent}
//             />
//             {/* <LinearProgress
//                 style={{}}
//                 value={1}
//                 color={woo_orange}
//                 variant="determinate"
//             /> */}

//             <ScrollView style={styles.wooContainer}>
//                 <LayoutWooInfo wooType={wooType} ownerUID={uid}
//                 />
//                 {/* {woo.item.image != null ?  */}
//                 <LayoutWooImage wooID={0} image={wooMedia} isPreview />
//                 {/* : <LayoutWooVideo video={woo.item.video} currentVisibleIndex={currentVisibleIndex} currentIndex={currentIndex} />} */}
//                 <LayoutWooLocation wooLocation={wooLocation} wooDate={wooDate} startTime={wooTime}
//                 // endTime={woo.item.woo_end_time}
//                 />
//                 <LayoutWooLike wooMigos={wooMigos} wooType={wooType} wooLikes={wooLikes} />
//                 <LayoutWooList chips={wooList} />
//             </ScrollView>

//         </View >
//     )

// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#fff"
//     },
//     wooContainer: {
//         flex: 14,
//         backgroundColor: woo_white,
//         padding: 5,
//         marginBottom: 10
//     },
//     profileInfo: {
//         textAlign: 'center'
//     },
//     header: {
//         shadowColor: '#000',
//         shadowOffset: { width: 1, height: 3 },
//         shadowOpacity: 0.2,
//         elevation: 4,
//     },
//     leftComponent: {
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     centerComponent: {
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     rightComponent: {
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
// })

// export default WooPreviewEditScreen
