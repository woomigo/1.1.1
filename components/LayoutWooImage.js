import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const LayoutWooImage = ({
  uid,
  woo,
  // wooID,
  // wooDate,
  // image,
  // wooLikes,
  // wooMigos,
  // wooType,
  // ownerUID,
  // ownerUsername,
  // ownerProfilePicture,
  // ownerFirstName,
  // ownerLastName,
  // wooLikedByMe,
  // wooTime,
  // wooLocation,
  // wooComments,
  // wooGallery,
  // wooList,
  // startTime,
  // endTime,
}) => {
  const navigation = useNavigation();

  return (
    <TouchableWithoutFeedback
      onPress={() =>
        navigation.navigate("Woo", {
          uid: uid,
          woo: woo,
        })
      }
      style={styles.container}
    >
      <Image style={styles.image} source={{ uri: woo.item.media_url }} />
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 8,
  },
  image: {
    backgroundColor: "#d9d9d9",
    height: 500,
    // width: '100%',
    borderRadius: 25,
    margin: 10,
  },
});

export default LayoutWooImage;
