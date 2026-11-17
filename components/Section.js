
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { woo_black } from "../assets/colors";

const Section = ({ title, children, style, titleStyle }) => {
  return (
    <View style={[styles.section, style]}>
      <Text style={[styles.title, titleStyle]}>
        {title}
      </Text>

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 8,
  },
  title: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "800",
    color: woo_black,
  },
});

export default Section;
