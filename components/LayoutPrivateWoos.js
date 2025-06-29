import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { woo_orange } from "../assets/colors";

const LayoutPrivateWoos = ({ woo, uid, isVisible, isRead = true }) => {
  useEffect(() => {
    console.log(woo)
  });

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback      onPress={() =>
        navigation.navigate("Woo", {
          uid: uid,
          woo: woo,
        })
      }>
        <View>
          {isVisible ? (
            <View style={isRead ? styles.image : styles.imageUnread}></View>
          ) : (
            <Image
              style={isRead ? styles.image : styles.imageUnread}
              source={{ uri: woo.item.media_url }}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    backgroundColor: "#d9d9d9",
    margin: 5,
    width: 150,
    height: 150,
    borderRadius: 25,
  },
  imageUnread: {
    backgroundColor: "#d9d9d9",
    margin: 5,
    width: 150,
    height: 150,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: woo_orange,
  },
});

export default LayoutPrivateWoos;
