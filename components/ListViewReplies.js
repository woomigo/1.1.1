import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import LayoutCommentItem from "./LayoutCommentItem";
import LayoutRepliesItem from "./LayoutRepliesItem";

const ListViewReplies = ({ uid, comments, isReplies, token }) => {
  const renderComments = (comment) => (
    <LayoutCommentItem uid={uid} token={token} comment={comment} comments={comments} />
  );

  const renderReplies = (comment) => (
    <LayoutRepliesItem uid={uid} comment={comment} comments={comments} token={token} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        backgroundColor={"#fff"}
        keyExtractor={(comment) => `${comment.id}`}
        data={comments}
        renderItem={isReplies ? renderReplies : renderComments}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ListViewReplies;
