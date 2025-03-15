import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const TopSheet = ({ content, isVisible = false }) => {

  const topPosition = useSharedValue(-300); // Initial position off-screen

  useEffect(() => {
    topPosition.value = isVisible ? -300 : 50; // Adjust as needed
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      top: withTiming(topPosition.value, { duration: 300 }),
    };
  });



  return (
    <View style={styles.container}>
      <Animated.View style={[styles.topSheet, animatedStyle]}>
        <Text>This is the Top Sheet Content</Text>
        {content}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topSheet: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    height: 300, // Adjust as needed
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
});

export default TopSheet;
