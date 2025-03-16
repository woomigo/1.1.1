import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { woo_black } from "../assets/colors";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";

const MigoGroupsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View
          style={{
            // backgroundColor: "blue",
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-start",
          }}
        >
          <Pressable onPress={() => navigation.navigate("Migos")}>
            <FontAwesome6Icon name="chevron-left" size={24} color={woo_black} />
          </Pressable>
        </View>
        <View
          style={{
            flex: 3,
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: woo_black,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            groups
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: 50,
    alignItems: "flex-end",
    flexDirection: "row",
    paddingHorizontal: 20,
  },
});

export default MigoGroupsScreen;
