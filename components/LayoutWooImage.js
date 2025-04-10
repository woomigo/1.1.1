import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const LayoutWooImage = ({
  wooID,
  wooDate,
  image,
  wooLikes,
  wooMigos,
  wooType,
  uid,
  ownerUID,
  wooTime,
  wooLocation,
  wooComments,
  wooGallery,
  wooList
}) => {
  const navigation = useNavigation();

  return (
    <TouchableWithoutFeedback
      onPress={() =>
        navigation.navigate("Woo", {
          wooDate,
          wooID,
          image,
          wooLikes,
          wooMigos,
          wooType,
          uid: uid,
          ownerUID,
          wooTime,
          wooLocation,
          wooComments,
          wooGallery,
          wooList
        })
      }
      style={styles.container}
    >
      <Image style={styles.image} source={{ uri: image }} />
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
