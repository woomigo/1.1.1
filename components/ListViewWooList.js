import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { ListItem } from "@rneui/themed";
import LayoutWooListItem from "./LayoutWooListItem";
import { woo_white } from "../assets/colors";

const ListViewWooList = ({ wooList, view, size, wooID }) => {
  const renderHorizontal = (item) => (
    <LayoutWooListItem
      size={size}
      view={"horizontal"}
      item={item.item}
      wooID={wooID}
    />
  );

  const renderList = (item) => (
    <LayoutWooListItem
      size={size}
      view={"list"}
      item={item.item}
      wooID={wooID}
    />
  );

  const renderGrid = (item) => (
    <LayoutWooListItem
      size={size}
      view={"grid"}
      item={item.item}
      wooID={wooID}
    />
  );

  const renderView = (view) => {
    switch (view) {
      case "horizontal":
        return (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            backgroundColor={"#fff"}
            data={wooList}
            renderItem={renderHorizontal}
          />
        );
      case "list":
        return (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            backgroundColor={"#fff"}
            data={wooList}
            renderItem={renderList}
          />
        );
      case "grid":
        return (
          <FlatList
            showsVerticalScrollIndicator={false}
            key={(woo) => woo.id}
            scrollEnabled={false}
            // style={{
            //   height: "100%",
            //   width: "100%",
            //   flexGrow: 0,
            //   marginTop: 10,
            // }}
            backgroundColor={woo_white}
            keyExtractor={(woo) => woo.id}
            numColumns={2}
            data={wooList}
            renderItem={renderGrid}
          />
        );
      default:
        return (
          <FlatList
            showsVerticalScrollIndicator={false}
            backgroundColor={"#fff"}
            data={wooList}
            renderItem={renderGrid}
          />
        );
    }
  };

  return renderView(view);
};

const styles = StyleSheet.create({
  container: {
    // flexDirection: "row"
  },
  truncTextContainer: {
    justifyContent: "flex-end",
  },
  truncText: {
    fontSize: 12,
    textDecorationLine: "underline",
    marginBottom: 10,
  },
});

export default ListViewWooList;
