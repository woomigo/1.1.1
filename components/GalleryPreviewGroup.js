import React, { useEffect } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { woo_orange, woo_white } from "../assets/colors";

const GalleryPreviewGroup = ({
  gallery,
  maxImage = 4,
  imageSize = 80,
  alignRow = "flex-end",
}) => {
  if (!gallery || gallery.length === 0) return null;

  const displayCount = maxImage;
  const extraCount = gallery.length - displayCount;

  return (
    <View style={[styles.galleryContainer, { justifyContent: alignRow }]}>
      <View style={styles.wooGalleryImagesContainer}>
        {gallery.slice(0, displayCount).map((image, index) => (
          <Image
            key={index}
            style={[
              styles.wooMigoImage,
              {
                width: imageSize,
                height: imageSize,
              },
            ]}
            source={{ uri: image.media_url }}
          />
        ))}
        {extraCount > 0 && (
          <View
            style={[
              styles.wooMigoImage,
              styles.extraCountBadge,
              {
                width: imageSize,
                height: imageSize,
              },
            ]}
          >
            <Text style={[styles.extraCountText, { fontSize: imageSize / 3 }]}>
              +{extraCount}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  galleryContainer: {
    flex: 1,
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  wooGalleryImagesContainer: {
    flexDirection: "row",
  },
  wooMigoImage: {
    backgroundColor: "#d9d9d9",
    marginHorizontal: 5,
    borderRadius: 10,
  },
  extraCountBadge: {
    backgroundColor: woo_orange,
    justifyContent: "center",
    alignItems: "center",
  },
  extraCountText: {
    color: woo_white,
  },
});

export default GalleryPreviewGroup;
