import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { woo_orange, woo_white } from "../assets/colors";

const MigosAvatarGroup = ({
  migos,
  maxAvatars = 4,
  avatarSize = 35,
  alignRow = "flex-end",
}) => {
  if (!migos || migos.length === 0) return null;

  const displayCount = maxAvatars;
  const extraCount = migos.length - displayCount;

  return (
    <View style={[styles.migosContainer, { justifyContent: alignRow }]}>
      <View style={styles.wooMigosImagesContainer}>
        {migos.slice(0, displayCount).map((uri, index) => (
          <Image
            key={index}
            style={[
              styles.wooMigoImage,
              {
                width: avatarSize,
                height: avatarSize,
                borderRadius: avatarSize / 2,
                marginEnd: -avatarSize / 3,
              },
            ]}
            source={{ uri }}
          />
        ))}
        {extraCount > 0 && (
          <View
            style={[
              styles.wooMigoImage,
              styles.extraCountBadge,
              {
                width: avatarSize,
                height: avatarSize,
                borderRadius: avatarSize / 2,
                marginEnd: -avatarSize / 3,
              },
            ]}
          >
            <Text style={[styles.extraCountText, { fontSize: avatarSize / 3 }]}>
              +{extraCount}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  migosContainer: {
    flex: 1,
    // marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  wooMigosImagesContainer: {
    flexDirection: "row",
  },
  wooMigoImage: {
    backgroundColor: "#d9d9d9",
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

export default MigosAvatarGroup;
