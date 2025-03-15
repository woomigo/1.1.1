import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const LayoutPrivateWoos = ({ image, isVisible }) => {
  useEffect(() => {});

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => {}}>
        <View>
          {isVisible ? (
            <View style={styles.image}></View>
          ) : (
            <Image style={styles.image} source={{ uri: image }} />
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
});

export default LayoutPrivateWoos;
