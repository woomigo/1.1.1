import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const Avatar = ({ name, image }) => {
  const initials =
    name &&
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return image ? (
    <Image source={{ uri: image }} style={styles.image} />
  ) : (
    <View style={styles.container}>
      <Text style={styles.text}>{initials}</Text>
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
