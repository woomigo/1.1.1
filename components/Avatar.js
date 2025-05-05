import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const Avatar = ({
  onPress,
  placeholder,
  name,
  image,
  size = 36,
  fontSize = 12,
}) => {
  const initials =
    name &&
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return image ? (
    <Image
      onPress={onPress}
      source={{ uri: image }}
      style={[
        styles.image,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    />
  ) : (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      {name ? (
        <Text onPress={onPress} style={[styles.text, { fontSize: fontSize }]}>
          {initials}
        </Text>
      ) : (
        <Text onPress={onPress} style={[styles.text]}>
          {placeholder}
        </Text>
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
