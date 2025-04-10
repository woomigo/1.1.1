import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { woo_orange } from "../assets/colors";

const ProgressBar = ({ itemsAmt, itemsSlctd, animated, backgroundColor }) => {
  const progress = itemsAmt > 0 ? Math.round((itemsSlctd / itemsAmt) * 100) : 0;

  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 500, // duration of the animation
      useNativeDriver: false, // we're animating layout width, so this must be false
    }).start();
  }, [progress]);

  const animatedStyle = {
    width: animatedWidth.interpolate({
      inputRange: [0, 100],
      outputRange: ["0%", "100%"],
    }),
  };

  return (
    <View style={styles.container}>
      {/* Background Bar */}
      <View style={[styles.backgroundBar, {backgroundColor: backgroundColor}]} />

      {/* Progress Bar */}
      {!animated && (
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      )}

      {/* Animated Progress Bar */}
      {animated && (
        <Animated.View style={[styles.progressBar, animatedStyle]} />
      )}

      {/* Text Overlay */}
      <View style={styles.textOverlay}>
        <Text style={styles.progressText}>{`${itemsSlctd}/${itemsAmt}`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 30,
    width: "100%",
    position: "relative",
    marginVertical: 10,
  },
  backgroundBar: {
    backgroundColor: "#d9d9d9",
    height: "100%",
    borderRadius: 15,
  },
  progressBar: {
    backgroundColor: woo_orange,
    height: "100%",
    borderRadius: 15,
    position: "absolute",
    top: 0,
    left: 0,
  },
  textOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    marginStart: 5,
    // alignItems: 'center',
  },

  progressText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ProgressBar;
