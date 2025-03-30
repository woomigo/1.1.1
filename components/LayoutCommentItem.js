import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { Avatar } from "@rneui/themed";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  doc,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import { woo_black } from "../assets/colors";
import { getTimeAgo } from "./utility";

const LayoutCommentItem = ({ uid, comment }) => {
  const [profilePicURL, setProfilePicURL] = useState();
  const [username, setUsername] = useState();
  const [user, setUser] = useState();
  const [timestamp, setTimestamp] = useState();
  const navigation = useNavigation();

  useEffect(() => {
    console.log(comment);
    setTimestamp(getTimeAgo(comment.item.timestamp.seconds));
    const docRef = doc(db, "users", comment.item.comment_owner_uid);
    const getProfileInfo = onSnapshot(
      docRef,
      (doc) => {
        // console.log("Document data:", doc.data());
        setUser(doc.data());
        setProfilePicURL(doc.data().profile_pic_url);
        setUsername(doc.data().username);
      },
      (error) => {}
    );

    return () => {
      getProfileInfo();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.commentHeaderContainer}>
        <TouchableWithoutFeedback>
          <Avatar rounded size="small" source={{ uri: profilePicURL }} />
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.commentHeaderUserContainer}>
        <TouchableWithoutFeedback
          onPress={() => {
            user.uid !== uid && navigation.navigate("User", { user: user });
          }}
        >
          <Text style={styles.commentUsername}>{username}</Text>
        </TouchableWithoutFeedback>
        <View style={styles.commentContainer}>
          <Text style={styles.comment}>{comment.item.comment}</Text>
        </View>
        <View style={styles.commentTimeReplyContainer}>
          <Text style={styles.commentTimeAgo}>{timestamp}</Text>
          <Text style={styles.replyText}>reply</Text>
        </View>
      </View>

      <View style={styles.likeContainer}>
        <TouchableOpacity style={styles.likeButton}>
          <FontAwesome6Icon name="heart" size={20} color={woo_black} />
          <Text style={styles.likeText}>{0}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    paddingVertical: 10,
    marginHorizontal: 10,
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: '#d9d9d9'
    // backgroundColor: "red",
  },
  commentHeaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    marginStart: 5,
    marginEnd: 5,
    // backgroundColor: "blue",
  },
  commentHeaderUserContainer: {
    flex: 5,
    
    // backgroundColor: "green",
  },

  commentUsername: {
    // backgroundColor: "aqua",
    marginBottom: 3,
    fontWeight: "bold",
    fontSize: 12,
  },
  commentTimeReplyContainer: {
    flexDirection: "row",
    // backgroundColor: "yellow",
    // marginEnd: 5,
  },
  likeContainer: {
    flex: 1,
    flexDirection: "column",
    // backgroundColor: "purple",
    justifyContent: "center",
    alignItems: "center",
  },
  commentTimeAgo: {
    justifyContent: "flex-end",
    // marginEnd: 5,
    fontSize: 10,
  },
  comment: {
    fontSize: 12,
    marginBottom: 10,
  },

  likeButton: {
    // backgroundColor: "orange",
    justifyContent: "center",
    alignItems: "center",
    // flexDirection: "row",
  },
  replyText: {
    marginStart: 20,
    fontSize: 10,
  },
  likeText: {
    marginStart: 3,
    fontSize: 10,
  },
});
export default LayoutCommentItem;
