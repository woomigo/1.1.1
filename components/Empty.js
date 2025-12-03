import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Empty = ({ message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  text: {
    fontSize: 14,
    color: "#777",
    fontStyle: "italic",
  },
});

export default Empty;
