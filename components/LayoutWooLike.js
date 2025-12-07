import { useEffect, useState } from "react";
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
import { localhost, truncNumber } from "./utility";
// import LayoutMigosItem from './LayoutMigosItem';

const LayoutWooLike = ({
  ownerUID,
  ownerUsername,
  ownerProfilePicture,
  ownerFirstName,
  ownerLastName,
  token,
  wooLikes,
  wooLikedByMe,
  uid,
  wooID,
}) => {
  const navigation = useNavigation();

  const [isLiked, setIsLiked] = useState(wooLikedByMe);
  const [wooLikeCount, setWooLikeCount] = useState(wooLikes);
  // const [isWooMigo, setIsWooMigo] = useState(false);
  // const [receivedUID, setReceiverUID] = useState([]);

  useEffect(() => {
    // console.log(` LWL ${wooID} ${wooLikes}`);
  }, [wooID, wooLikes]);

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

  const toggleIsLiked = () => {
    isLiked ? removeWooLike(wooID) : addWooLike(wooID);
    // setIsLiked(!isLiked)
    // saveNotification();
  };

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
              onPressOut={toggleIsLiked}
            >
              <Icon
                name="heart"
                type="font-awesome-5"
                color={woo_orange}
                solid={isLiked ? true : false}
                size={25}
                onPress={toggleIsLiked}
              />
            </Pressable>
            <Text style={{ fontSize: 12 }}>{truncNumber(wooLikeCount)}</Text>
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
