import React, { useEffect, useState } from "react";
import { View, TouchableWithoutFeedback, StyleSheet, Text } from "react-native";
import { Chip, Avatar, LinearProgress } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { woo_gray, woo_orange, woo_white } from "../assets/colors";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import ProgressBar from "./ProgressBar";
import { Picker } from "@react-native-picker/picker";
import ItemCounter from "./SelectableInputCounter";
import SelectableInputCounter from "./SelectableInputCounter";

const LayoutWooListItem = ({
  item,
  size,
  itemsAmt = 5,
  itemsSlctd = 2,
  view,
}) => {
  const [selectedItem, setSelectedItem] = useState(0);
  const itemsLeft = itemsAmt - itemsSlctd;

  useEffect(() => {
    console.log("LWLIT" + item);
    console.log("User selected:", selectedItem);
  });
  const navigation = useNavigation();

  const setHorizontalSize = () => {
    switch (size) {
      case "med":
        return 40;
      case "lrg":
        return 60;
      case "xlrg":
        return 80;
      case "small":
      default:
        return 25;
    }
  };

  const setGridSize = () => {
    switch (size) {
      case "med":
        return 400;
      case "lrg":
        return 600;
      case "xl":
        return 800;
      case "small":
      default:
        return 250;
    }
  };

  const returnView = () => {
    switch (view) {
      case "grid":
        return (
          <View style={[styles.card, { flex: 1 }]}>
            <Text>{item}</Text>
          </View>
        );
      case "list":
        return 60;
      case "horizontal":
        return 80;
      case "small":
      default:
        return 25;
    }
  };

  return (
    <View
      style={{
        flex: 1,
        // flexDirection: "row",
        alignItems: "center",
        // justifyContent: "flex-start",
      }}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: selectedItem > 0 ? '#d9d9d9' : woo_white,
            width: 180,
            height: 250,
          },
        ]}
      >
        <Avatar
          size={60}
          rounded
          icon={{ name: "list", type: "font-awesome", color: selectedItem > 0 ? '#d9d9d9' : woo_white, size: 24 }}
          containerStyle={{ backgroundColor: !selectedItem > 0 ? '#d9d9d9' : woo_white, margin: 5 }}
        />
        <Text>{item}</Text>
        <ProgressBar backgroundColor={selectedItem > 0 ? woo_white : '#d9d9d9'} itemsAmt={itemsAmt} itemsSlctd={itemsSlctd} animated />
        <SelectableInputCounter
          itemsAmt={itemsAmt}
          itemsSlctd={itemsSlctd}
          onChange={(val) => setSelectedItem(val)}
        />
      </View>

      {/* <TouchableWithoutFeedback
        onPress={() => {
          console.log("chip pressed");
          navigation.navigate("WooListView", { wooID: wooID });
        }}
      >
        <Chip
          onPress={() => {
            console.log("chip pressed");
            navigation.navigate("WooListView", { wooID: wooID });
          }}
          title={chip}
          color={woo_orange}
          containerStyle={{ marginStart: 10, marginVertical: 10 }}
        />
      </TouchableWithoutFeedback> */}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: woo_white,
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
    // marginBottom: 15,
  },
});

export default LayoutWooListItem;
