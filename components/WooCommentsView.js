import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  KeyboardAvoidingView,
} from "react-native";
import { Icon, Header, Input, Avatar } from "@rneui/themed";
import ListViewComments from "./ListViewComments";
import { woo_black, woo_white } from "../assets/colors";
import { doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

const WooCommentsView = ({ navigation, route }) => {
  const { uid, wooID, comments, token } = route.params;

  const [comment, setComment] = useState();
  const [wooComments, setWooComments] = useState();
  const [isCommentError, setIsCommentError] = useState();
  const [isCommentIconHidden, setCommentIconHidden] = useState(true);

  const commentRef = useRef();

  const [profilePicURL, setProfilePicURL] = useState();

  useEffect(() => {
    console.log(`COMMENT SCREEN ${JSON.stringify(comments)}`)
  }, []);

  const addCommentToWoo = async () => {
    console.log("FUCK");
    await setDoc(
      doc(db, "woos", wooID),
      {
        woo_comments: {
          comment: comment,
          comment_owner_uid: uid,
          timestamp: serverTimestamp(),
        },
      },
      { merge: true }
    );
    console.log("ADD");
    setComment("");
    commentRef.current.clear();
    commentRef.current.blur();
  };

  const handleCommentOnChange = (input) => {
    if (input.length > 0) {
      setCommentIconHidden(false);
    } else {
      setCommentIconHidden(true);
    }
    setIsCommentError(false);
    setComment(input);
  };

  const handleCommentEndEditing = () => {
    setCommentIconHidden(true);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Header
          containerStyle={styles.header}
          backgroundColor={woo_white}
          leftComponent={
            <Icon
              name="chevron-left"
              type="font-awesome-5"
              color={woo_black}
              size={20}
              onPress={() => navigation.goBack()}
            />
          }
          centerComponent={
            <View>
              <Text
                style={{
                  fontSize: 25,
                  color: woo_black,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                woo comments
              </Text>
            </View>
          }
          leftContainerStyle={styles.leftComponent}
          centerContainerStyle={styles.centerComponent}
        />
        <ListViewComments uid={uid} comments={comments} token={token} />
        <KeyboardAvoidingView behavior="position">
          <Input
            value={comment}
            ref={commentRef}
            fontSize={14}
            onChangeText={(text) => handleCommentOnChange(text)}
            placeholder="comment"
            leftIcon={
              <Avatar rounded size="small" source={{ uri: profilePicURL }} />
            }
            autoCapitalize="none"
            onEndEditing={() => handleCommentEndEditing()}
            rightIcon={
              !isCommentIconHidden && (
                <Icon
                  name="play"
                  type="font-awesome-5"
                  size={18}
                  onPress={() => addCommentToWoo()}
                />
              )
            }
          />
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: woo_white,
  },
  header: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
    marginBottom: 5,
  },
  leftComponent: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerComponent: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default WooCommentsView;
