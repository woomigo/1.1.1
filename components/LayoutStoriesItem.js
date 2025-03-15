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

const LayoutStoriesItem = ({ image, isRead = true }) => {
  useEffect(() => {});

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => {}}>
        <Image  style={isRead ? styles.image : styles.imageUnread} source={{ uri: image }} />
      </TouchableWithoutFeedback>
      <Text style={styles.text}>username</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    margin: 5,
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  imageUnread: {
    margin: 5,
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: woo_orange
  },
  text: {
    marginHorizontal: 5,
    fontSize: 12,
  },
});

export default LayoutStoriesItem;
