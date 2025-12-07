import { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Avatar } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { woo_white } from "../assets/colors";
import ProgressBar from "./ProgressBar";
import SelectableInputCounter from "./SelectableInputCounter";

const LayoutWooListItem = ({ item, size, itemsAmt, itemsSlctd, view }) => {
  const [selectedItem, setSelectedItem] = useState(0);
  const itemsLeft = itemsAmt - itemsSlctd;

  useEffect(() => {
    // console.log("VIEW " + view);
    // console.log("LWLIT " + JSON.stringify(item));
    // console.log("User selected: ", selectedItem);
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
          <View
            style={[
              styles.card,
              {
                backgroundColor: selectedItem > 0 ? "#d9d9d9" : woo_white,
                width: 180,
                height: 250,
              },
            ]}
          >
            <Avatar
              size={60}
              rounded
              icon={{
                name: "list",
                type: "font-awesome",
                color: selectedItem > 0 ? "#d9d9d9" : woo_white,
                size: 24,
              }}
              containerStyle={{
                backgroundColor: !selectedItem > 0 ? "#d9d9d9" : woo_white,
                margin: 5,
              }}
            />
            <Text>{item}</Text>
            <ProgressBar
              backgroundColor={selectedItem > 0 ? woo_white : "#d9d9d9"}
              itemsAmt={itemsAmt}
              itemsSlctd={itemsSlctd}
              animated
            />
            <SelectableInputCounter
              itemsAmt={itemsAmt}
              itemsSlctd={itemsSlctd}
              onChange={(val) => setSelectedItem(val)}
            />
          </View>
        );
      case "preview":
        return (
          <View
            style={[
              styles.card,
              {
                backgroundColor: selectedItem > 0 ? "#d9d9d9" : woo_white,
                width: 80,
                height: 100,
              },
            ]}
          >
            <Avatar
              size={28}
              rounded
              icon={{
                name: "list",
                type: "font-awesome",
                color: selectedItem > 0 ? "#d9d9d9" : woo_white,
                size: 12,
              }}
              containerStyle={{
                backgroundColor: !selectedItem > 0 ? "#d9d9d9" : woo_white,
                margin: 5,
              }}
            />
            <Text style={{ fontSize: 10 }}>{item.name}</Text>
          </View>
        );
      case "horizontal":
        return (
          <View
            style={[
              styles.card,
              {
                backgroundColor: selectedItem > 0 ? "#d9d9d9" : woo_white,
                width: 80,
                height: 100,
              },
            ]}
          >
            <Avatar
              size={28}
              rounded
              icon={{
                name: "list",
                type: "font-awesome",
                color: selectedItem > 0 ? "#d9d9d9" : woo_white,
                size: 12,
              }}
              containerStyle={{
                backgroundColor: !selectedItem > 0 ? "#d9d9d9" : woo_white,
                margin: 5,
              }}
            />
            <Text style={{ fontSize: 10 }}>{item}</Text>
          </View>
        );
      case "small":
      default:
        return 25;
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
      }}
    >
      {returnView()}
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
  },
});

export default LayoutWooListItem;
