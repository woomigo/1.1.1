import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { woo_black, woo_white } from "../assets/colors";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import Avatar from "./Avatar";
import GroupListView from "./GroupListView";
import { getTimeAgo } from "./utility";
import MigosAvatarGroup from "./MigosAvatarGroup";

const LayoutGroupItem = ({ item }) => {
  useEffect(() => {
    console.log("GROUP ITEM " + JSON.stringify(item));
  }, []);

  const screenWidth = Dimensions.get("window").width;
  const numColumns = 2;
  const totalHorizontalMargin = 8 * 2 * numColumns; // total horizontal padding (e.g. margin or padding between cards, so 8 =s the margin on card)
  const cardWidth = (screenWidth - totalHorizontalMargin) / numColumns;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: woo_white,
          width: cardWidth,
          height: 250,
        },
      ]}
    >
      <Avatar size={60} image={item.profile_pic_url} name={item.name} />
      <Text style={{ fontSize: 14, fontWeight: "bold", marginTop: 10 }}>
        {item.name}
      </Text>
      <Text style={{ fontSize: 12, marginTop: 5, textAlign: "center" }}>
        {item.description}
      </Text>
      <MigosAvatarGroup maxAvatars={3} migos={item.member_profile_pics} />
      <Text style={{ fontSize: 12, marginTop: 15 }}>
        users: {item.member_count}
      </Text>
      <Text style={{ fontSize: 12, marginTop: 5 }}>
        created: {getTimeAgo(item.created_at)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: woo_white,
    margin: 8,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
  },
  migosContainer: {
    flex: 1,
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  wooMigosImagesContainer: {
    flexDirection: "row",
  },
  wooMigoImage: {
    backgroundColor: "#d9d9d9",
    width: 35,
    height: 35,
    borderRadius: 18,
    marginEnd: -10,
  },
});

export default LayoutGroupItem;
