import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { woo_black, woo_orange } from "../assets/colors";

const SuggestedUserCard = ({ user, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(user)}>
      <Image source={{ uri: user.avatar }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.username}>@{user.username}</Text>
        <Text style={styles.name}>{user.name}</Text>
      </View>
      <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followText}>Follow</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1, // important for 2 columns
    flexDirection: "column", // stack avatar/info vertically
    alignItems: "center",
    padding: 12,
    marginHorizontal: 0, // handled by columnWrapperStyle
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
  },
  info: {
    alignItems: "center",
    marginBottom: 8,
  },
  username: {
    fontWeight: "bold",
    fontSize: 14,
    color: woo_black,
  },
  name: {
    color: "#777",
    fontSize: 12,
  },
  followButton: {
    backgroundColor: woo_orange,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  followText: {
    color: "#fff",
    fontWeight: "bold",
  },
});


export default SuggestedUserCard;
