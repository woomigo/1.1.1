import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Text,
  Image,
  FlatList,
  Alert,
  Pressable,
} from "react-native";
import { Icon, Card } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { woo_black, woo_gray, woo_orange } from "../assets/colors";
import {
  collection,
  addDoc,
  updateDoc,
  arrayUnion,
  doc,
  arrayRemove,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import { truncNumber } from "./utility";
// import LayoutMigosItem from './LayoutMigosItem';

const LayoutWooLike = ({
  ownerUID,
  ownerUsername,
  ownerProfilePicture,
  ownerFirstName,
  ownerLastName,
  wooLikes,
  wooLikedByMe,
  uid,
  wooID,
}) => {
  const navigation = useNavigation();

  // const [isLiked, setIsLiked] = useState(false);
  // const [isWooMigo, setIsWooMigo] = useState(false);
  // const [receivedUID, setReceiverUID] = useState([]);

  // useEffect(() => {
  //   wooLikes.includes(uid) ? setIsLiked(true) : setIsLiked(false);
  //   wooMigos.includes(uid) ? setIsWooMigo(true) : setIsWooMigo(false);
  // });

  // const addUIDToWooLikes = async () => {
  //   await updateDoc(doc(db, "woos", wooID), {
  //     woo_likes: arrayUnion(uid),
  //   });
  //   console.log("ADD");
  // };

  // const removeUIDFromWooLikes = async () => {
  //   await updateDoc(doc(db, "woos", wooID), {
  //     woo_likes: arrayRemove(uid),
  //   });
  //   console.log("REMOVE");
  // };

  // const addWooToProfile = async () => {
  //   await updateDoc(doc(db, "woos", wooID), {
  //     woo_migos: arrayUnion(uid),
  //     migo_woos: arrayRemove(uid),
  //   });
  // };

  // const removeWooFromProfile = async () => {
  //   await updateDoc(doc(db, "woos", wooID), {
  //     woo_migos: arrayRemove(uid),
  //     migo_woos: arrayUnion(uid),
  //   });
  // };

  // const saveNotification = async () => {
  //     try {
  //         const docRef = await updateDoc(doc(db, "notifications"), {
  //             is_read: false, notification_message: "liked your woo!", notification_type: "woo like", owner_uid: uid, receiver_uid: arrayUnion(ownerUID), timestamp: serverTimestamp, woo_id: wooID
  //         })
  //         console.log("NOTIFICATION SAVED TO DB ", JSON.stringify(docRef))
  //     } catch (error) {
  //         console.error("SAVE NOTIFICATION ERROR " + error)
  //     }
  // }

  // const saveNotification = async () => {
  //   const timestamp = serverTimestamp();
  //   if (uid != ownerUID) {
  //     // prevents sending notification to self for liking own woo
  //     try {
  //       const docRef = await addDoc(collection(db, "notifications"), {
  //         is_read: false,
  //         notification_message: "liked your woo!",
  //         notification_type: "woo like",
  //         owner_uid: uid,
  //         timestamp: timestamp,
  //         receiver_uid: arrayUnion(ownerUID),
  //         woo_id: wooID,
  //       });
  //       console.log("NOTIFICATION SAVED TO DB ", JSON.stringify(docRef));
  //     } catch (error) {
  //       console.error("SAVE NOTIFICATION ERROR " + error);
  //     }
  //   }
  // };

  // const toggleIsLiked = () => {
  //   isLiked ? removeUIDFromWooLikes() : addUIDToWooLikes();
  //   saveNotification();
  // };

  // const toggleAddWoo = () => {
  //   isWooMigo ? removeWooFromProfile() : addWooToProfile();
  // };

  const confirmAddToWoo = () =>
    Alert.alert(
      "Add Woo",
      "Are you sure you would like to add this woo to your woos?",
      [
        {
          text: "Add",
          onPress: () => navigation.navigate("Woos"),
          style: "default",
        },
        {
          text: "Cancel",
          style: "destructive",
          onPress: () => {
            console.log("Clear Pressed");
            clearNotfications;
          },
        },
      ]
    );

  return (
    <View style={styles.container}>
      <View style={styles.likesWooMigosContainer}>
        <View style={styles.likesContainer}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Pressable
              style={{
                width: 40,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
              // onPressOut={toggleIsLiked}
            >
              <Icon
                name="heart"
                type="font-awesome-5"
                color={woo_orange}
                solid={wooLikedByMe ? true : false}
                size={25}
                // onPress={toggleIsLiked}
              />
            </Pressable>
            <Text style={{ fontSize: 12 }}>{truncNumber(wooLikes)}</Text>
          </View>

          <FontAwesome6Icon
            name="paper-plane"
            size={25}
            color={woo_black}
            onPress={() => setIsPrivateVisible(!isPrivateVisible)}
          />

          <FontAwesome6Icon
            name="bookmark"
            size={25}
            color={woo_black}
            onPress={() => setIsPrivateVisible(!isPrivateVisible)}
          />
        </View>
        <View style={styles.menuContainer}>
          <FontAwesome6Icon
            name="ellipsis"
            size={20}
            color={woo_black}
            onPress={() => setIsPrivateVisible(!isPrivateVisible)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  likesWooMigosContainer: {
    marginEnd: 10,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  likesContainer: {
    flex: 1,
    marginHorizontal: 15,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  menuContainer: {
    flex: 1,
    marginHorizontal: 15,
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  wooMigosContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginEnd: 5,
  },
  wooMigoCountText: {
    textDecorationLine: "underline",
  },
  wooMigosImagesContainer: {
    flexDirection: "row",
  },
  wooMigoImage: {
    width: 30,
    height: 30,
    borderRadius: 25,
    marginEnd: 5,
    marginRight: -20,
  },
});

export default LayoutWooLike;

{
  /* {wooType !== "private" ? (
            <TouchableOpacity onPress={() => navigation.navigate("Share")}>
              <Icon name="share" type="font-awesome-5" color={woo_gray} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity></TouchableOpacity>
          )}

          {wooType === "public" && uid != ownerUID ? (
            <TouchableOpacity
              style={{ marginStart: 50 }}
              onPress={toggleAddWoo}
            >
              {isWooMigo ? (
                <Icon
                  name="check-square"
                  type="font-awesome-5"
                  color={woo_gray}
                />
              ) : (
                <Icon
                  name="plus-square"
                  type="font-awesome-5"
                  color={woo_gray}
                />
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity></TouchableOpacity>
          )} */
}

{
  /* {wooMigos && (
          <View style={styles.wooMigosContainer}>
            <View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("WooMigosView", { migos: wooMigos })
                }
              >
                <Text style={styles.wooMigoCountText}>
                  {Object.keys(wooMigos).filter((key) => key >= 0).length}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.wooMigosImagesContainer}>
              {wooMigos.length > 0 && <WooMigoImage userID={wooMigos[0]} />}
              {wooMigos.length > 1 && <WooMigoImage userID={wooMigos[1]} />}
              {wooMigos.length > 2 && <WooMigoImage userID={wooMigos[2]} />}
              {wooMigos.length > 3 && <WooMigoImage userID={wooMigos[3]} />}
            </View>
          </View>
        )} */
}
