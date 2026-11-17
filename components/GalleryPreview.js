import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import GalleryPreviewGroup from "./GalleryPreviewGroup";
import { woo_black } from "../assets/colors";

const GalleryPreview = ({ gallery = [], navigation, onPress }) => {
  const hasGallery = gallery && gallery.length > 0;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      {hasGallery ? (
        <GalleryPreviewGroup
          gallery={gallery}
          maxImage={3}
          imageSize={80}
          alignRow="flex-start"
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>no gallery</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    marginBottom: 5,
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

export default GalleryPreview;
