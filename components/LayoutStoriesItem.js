import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const LayoutStoriesItem = ({ image }) => {
  useEffect(() => {});

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => {}}>
        <Image style={styles.image} source={{ uri: image }} />
      </TouchableWithoutFeedback>
      <Text style={styles.text}>username</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    margin: 5,
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  text: {
    marginHorizontal: 5,
    fontSize: 12
  },
});

export default LayoutStoriesItem;
