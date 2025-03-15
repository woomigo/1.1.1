import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ImageBackground,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome6";
import { Icon, Overlay, Button, Dialog } from "@rneui/themed";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import {
  woo_gray,
  woo_orange,
  woo_red,
  woo_white,
  woo_black,
} from "../assets/colors";
import { db, storage } from "../firebaseConfig";
import TopSheet from "./TopSheetComponent";

const EditMediaScreen = ({ navigation, route }) => {
  const { uid, wooMedia, isImage } = route.params;
  const [visible, setVisible] = useState(false);
  const [imageStorageProgress, setImageStorageProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const userRef = doc(db, "users", uid);

  const topPosition = useSharedValue(-300); // Initial position off-screen

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      top: withTiming(topPosition.value, { duration: 300 }),
    };
  });

  const toggleTopSheet = () => {
    setIsVisible(!isVisible);
  };

  const uploadImage = async (uri, fileType) => {
    setLoading(true);
    const res = await fetch(uri);
    if (res.ok) {
      const blobImage = await res.blob();

      const storageRef = ref(storage, "gallery/" + uid + new Date().getTime());

      const uploadTask = uploadBytesResumable(storageRef, blobImage);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageStorageProgress(progress.toFixed());
        },
        (error) => {
          console.error(`UPLOAD IMAGE TO STORAGE ERROR === ${error}`);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
            console.log(url);
            addMediaToProfile(url);
          });
        }
      );
    }
  };

  const addMediaToProfile = async (url) => {
    await updateDoc(userRef, {
      gallery: arrayUnion(url),
    });
    setLoading(false);
    navigation.popToTop();
    navigation.navigate("Profile");
  };

  useEffect(() => {
    topPosition.value = isVisible ? -650 : -350;
  }, [isVisible]);

  return (
    <View style={styles.container}>
      <ImageBackground
        style={{ flex: 1, width: "100%" }}
        source={wooMedia}
        // placeholder={{ blurhash }}
        contentFit="cover"
        transition={1000}
      >
        <Dialog isVisible={loading}>
          <Dialog.Title
            title="uploading image to profile"
            titleStyle={{ textAlign: "center" }}
          />

          <Dialog.Loading />
        </Dialog>
        <View style={styles.buttonContainer}>
        <TopSheet isVisible={isVisible} />
          <Animated.View style={[styles.topSheet, animatedStyle]}>
            <View style={styles.topButtonContainer}> 
            <View style={styles.filterButtonContainer}>   
              <TouchableOpacity
                  style={styles.filterButton}
                  onPress={() => navigation.navigate("Camera")}
                >
                  <Icon
                    name="times"
                    type="font-awesome-5"
                    color={woo_black}
                    size={30}
                  />
                </TouchableOpacity>
                </View>
              <View style={styles.filterButtonContainer}>
                <TouchableOpacity
                  style={styles.filterButton}
                  onPress={toggleTopSheet}
                >
                  <FontAwesomeIcon name="sliders" size={30} color={woo_black} />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
          <View style={styles.bottomButtonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => uploadImage(wooMedia.uri)}
            >
              <Icon
                name="user-plus"
                type="font-awesome-5"
                color={woo_black}
                size={30}
              />
            </TouchableOpacity>
            <Pressable
              style={styles.button}
              onPress={() =>
                navigation.navigate("AddMediaWooGallery", {
                  wooMedia: wooMedia,
                })
              }
            >
              <Icon
                name="images"
                type="font-awesome-5"
                color={woo_black}
                size={30}
              />
            </Pressable>
            <TouchableOpacity style={styles.button} onPress={toggleOverlay}>
              <Icon
                name="chevron-right"
                type="font-awesome-5"
                color={woo_black}
                size={35}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
      <Overlay
        overlayStyle={styles.overlay}
        isVisible={visible}
        onBackdropPress={toggleOverlay}
      >
        <Text style={styles.textPrimary}>woo type?</Text>
        {/* <Text style={styles.textSecondary}>
                    private woo can only be seen by 
                </Text> */}
        <Button
          icon={
            <Icon
              name="lock"
              type="font-awesome"
              color={woo_white}
              size={25}
              iconStyle={{ marginRight: 10 }}
            />
          }
          title="send a private woo"
          onPress={() => {
            toggleOverlay();
            navigation.navigate("WooMigos", {
              wooMedia: wooMedia,
              wooType: "private",
            });
          }}
          buttonStyle={{ margin: 10, backgroundColor: woo_gray, borderRadius: 25 }}
        />
        <Button
          icon={
            <Icon
              name="users"
              type="font-awesome"
              color={woo_white}
              size={25}
              iconStyle={{ marginRight: 10 }}
            />
          }
          title="post a public woo"
          onPress={() => {
            toggleOverlay();
            navigation.navigate("WooDate", {
              wooMedia: wooMedia,
              wooType: "public",
            });
          }}
          buttonStyle={{ margin: 10, backgroundColor: woo_gray, borderRadius: 25 }}
        />
        <Button
          icon={
            <Icon
              name="times"
              type="font-awesome"
              color={woo_white}
              size={25}
              iconStyle={{ marginRight: 8 }}
            />
          }
          title="back to edit woo"
          onPress={toggleOverlay}
          buttonStyle={{ margin: 10, backgroundColor: woo_red, borderRadius: 25 }}
        />
      </Overlay>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "space-between",
  },
  topButtonContainer: {
    flex: 1,
    backgroundColor: 'red',
    flexDirection: "row",
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  bottomButtonContainer: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginBottom: 50,
    marginHorizontal: 40,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  overlay: {
    padding: 40,
    borderRadius: 50,
    // backgroundColor: 'red'
  },
  filterButtonContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: 50,
    borderRadius: 35,
  },
  filterButton: {
    backgroundColor: "#d9d9d950",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  button: {
    backgroundColor: "#d9d9d9",
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  textPrimary: {
    marginVertical: 20,
    textAlign: "center",
    fontSize: 20,
  },
  textSecondary: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 17,
  },
});

// buttonContainer: {
//     flex: 1,
//     backgroundColor: 'transparent',
//     justifyContent: 'space-between'
// },
// topButtonContainer: {
//     backgroundColor: 'red',
//     flexDirection: 'row',
//     marginTop: 75,
//     marginHorizontal: 20
// },
// bottomButtonContainer: {
//     // backgroundColor: 'green',
//     marginBottom: 75,
//     marginHorizontal: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center'
// },

export default EditMediaScreen;
