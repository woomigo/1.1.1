import { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { woo_black, woo_white } from "../assets/colors";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import { Avatar } from "@rneui/themed";
import GroupsListView from "./GroupsListView";

const MigoGroupsScreen = ({ navigation, route }) => {
  const { user, token } = route.params;

  useEffect(() => {}, []);

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
            flex: 5,
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: woo_black,
              paddingBottom: 3,
              fontWeight: "bold",
            }}
          >
            groups
          </Text>
        </View>
        <View
          style={{
            flex: 2,
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <View
            style={{
              flex: 1,

              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <Pressable
              onPress={() => navigation.navigate("CreateEditGroup")}
            >
              <FontAwesome6Icon name="plus" size={26} color={woo_black} />
            </Pressable>
          </View>
        </View>
      </View>

      <GroupsListView userId={user.id} token />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: woo_white,
  },
  header: {
    height: 50,
    alignItems: "flex-end",
    flexDirection: "row",
    paddingHorizontal: 20,
  },
});

export default MigoGroupsScreen;
