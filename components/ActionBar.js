import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import {
  woo_black,
  woo_white,
  woo_orange,
  woo_medium_gray,
} from "../assets/colors";

const ActionBar = ({
  liked,
  likeCount,
  subscribed,
  hostName,
  wooType,
  onToggleLike,
  onToggleSubscribe,
  onShare,
  style,
}) => {
  return (
    <View style={[styles.row, style]}>
      {/* LIKE */}
      <Pressable
        onPress={onToggleLike}
        accessibilityRole="button"
        accessibilityLabel={liked ? "Unlike event" : "Like event"}
        accessibilityState={{ selected: liked }}
        style={({ pressed }) => [
          styles.pill,
          liked && styles.pillActive,
          pressed && styles.pillPressed,
        ]}
      >
        <FontAwesome6Icon
          name="heart"
          size={20}
          color={liked ? woo_orange : woo_black}
          solid={liked}
        />

        <Text style={[styles.label, liked && styles.labelActive]}>
          {likeCount ?? 0}
        </Text>
      </Pressable>

      {/* SUBSCRIBE - PUBLIC WOO ONLY */}
      {wooType === "public" && (
        <Pressable
          onPress={onToggleSubscribe}
          accessibilityRole="button"
          accessibilityLabel={
            subscribed
              ? `Unsubscribe from ${hostName}`
              : `Subscribe to ${hostName}`
          }
          accessibilityState={{ selected: subscribed }}
          style={({ pressed }) => [
            styles.pill,
            subscribed ? styles.pillActive : styles.pillPrimary,
            pressed && styles.pillPressed,
          ]}
        >
          <Text
            style={[
              styles.label,
              subscribed ? styles.labelActive : styles.labelOnPrimary,
            ]}
          >
            {subscribed ? "Subscribed" : "Subscribe"}
          </Text>
        </Pressable>
      )}

      {/* SHARE */}
      <Pressable
        onPress={onShare}
        accessibilityRole="button"
        accessibilityLabel="Share event"
        style={({ pressed }) => [styles.pill, pressed && styles.pillPressed]}
      >
        <FontAwesome6Icon name="paper-plane" size={20} color={woo_black} />

        <Text style={styles.label}>Share</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: 30,
    backgroundColor: woo_medium_gray,
  },
  pillActive: {
    backgroundColor: "#FFF0E5",
  },
  pillPrimary: {
    backgroundColor: woo_orange,
  },
  pillPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  label: {
    fontWeight: "bold",
    fontSize: 15,
    color: woo_black,
  },
  labelActive: {
    color: woo_orange,
  },
  labelOnPrimary: {
    color: woo_white,
  },
});

export default ActionBar;
