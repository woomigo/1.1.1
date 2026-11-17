
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import { woo_black, woo_white } from "../assets/colors";

const Avatar = ({
  onPress,
  placeholder,
  name,
  image,
  size = 36,
  fontSize = 12,
  style,
  border = false,
  borderWeight = 1,
  borderColor = woo_black,
}) => {
  const initials =
    name &&
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const borderStyle = border
    ? { borderWidth: borderWeight, borderColor }
    : {};

  return image ? (
    <Image
      onPress={onPress}
      source={{ uri: image }}
      style={[
        styles.image,
        { width: size, height: size, borderRadius: size / 2 },
        borderStyle,
        style,
      ]}
    />
  ) : (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2 },
        borderStyle,
        style,
      ]}
    >
      {name ? (
        <Text onPress={onPress} style={[styles.text, { fontSize: fontSize }]}>
          {initials}
        </Text>
      ) : (
        <FontAwesome6Icon name="user" size={30} color={woo_white} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#007AFF",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
  image: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
});

export default Avatar;
