
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import Avatar from "./Avatar";
import { woo_black } from "../assets/colors";
import { getTimeAgo } from "./utility";

const CommentsPreview = ({
  comments = [],
  navigation,
  onPress,
}) => {
  const hasComments = comments && comments.length > 0;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.container}
    >
      {hasComments ? (
        <>
          <View style={styles.commentHeaderContainer}>
            <View style={styles.commentHeaderUserContainer}>
              <Avatar
                size={35}
                image={comments[0].profile_pic_url}
                onPress={() => navigation.navigate("Profile")}
              />

              <View style={styles.commentContent}>
                <Text style={styles.commentUsername}>
                  {comments[0].username}
                </Text>

                <Text style={styles.comment}>
                  {comments[0].content}
                </Text>

                <Text style={styles.commentTimeAgo}>
                  {getTimeAgo(comments[0].created_at)}
                </Text>
              </View>
            </View>

            <View style={styles.likeContainer}>
              <FontAwesome6Icon
                name="heart"
                size={18}
                color={woo_black}
              />
              <Text style={styles.likeText}>
                {comments[0].like_count ?? 0}
              </Text>
            </View>
          </View>

          <Text style={styles.seeMoreCommentsText}>
            {comments.length > 1
              ? `see ${comments.length - 1} more comment${
                  comments.length - 1 > 1 ? "s" : ""
                }...`
              : "add a comment..."}
          </Text>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text>be the first to comment</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  commentHeaderContainer: {
    flexDirection: "row",
  },
  commentHeaderUserContainer: {
    flexDirection: "row",
    flex: 5,
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    marginStart: 5,
    fontWeight: "bold",
    fontSize: 14,
    color: woo_black,
  },
  comment: {
    marginStart: 5,
    fontSize: 12,
    color: woo_black,
  },
  commentTimeAgo: {
    marginStart: 5,
    marginTop: 3,
    fontSize: 8,
  },
  likeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  likeText: {
    marginStart: 3,
    fontSize: 10,
  },
  seeMoreCommentsText: {
    marginStart: 40,
    marginTop: 10,
    textDecorationLine: "underline",
    fontSize: 12,
    color: woo_black,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
});

export default CommentsPreview;
