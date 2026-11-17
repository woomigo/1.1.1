
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import WooListItems from "./WooListItems";
import { woo_black } from "../assets/colors";

const WooListPreview = ({ user, items = [], token, onPress }) => {
  const hasItems = items && items.length > 0;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      {hasItems ? (
        <WooListItems
          user={user}
          items={items}
          token={token}
          showPreviewOnly
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>all we need is you!</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
  emptyText: {
    color: woo_black,
  },
  pressed: {
    opacity: 0.85,
  },
});

export default WooListPreview;
