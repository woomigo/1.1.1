import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Button, ListItem } from "@rneui/themed";
import LayoutWooListItem from "./LayoutWooListItem";
import { woo_orange, woo_white } from "../assets/colors";
import SearchInput from "./SearchInput";

const ListViewWooList = ({ wooList, view, size, wooID }) => {
  const [filteredResults, setFilteredResults] = useState(wooList);
  const [itemsAmt, setItemsAmt] = useState(5);
  const [itemsSlctd, setItemsSlctd] = useState(2);

  useEffect(() => {
    console.log(`WOOLIST ==== ${JSON.stringify(wooList)}`);
  });

  const handleListUpdate = (update) => {
    console.log("list updated to" + update);
  };

  const renderHorizontal = (item) => (
    <LayoutWooListItem
      size={size}
      view={"horizontal"}
      item={item}
      wooID={wooID}
    />
  );

  const renderPreview = (item) => (
    <LayoutWooListItem
      size={size}
      view={"preview"}
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
      itemsAmt={5}
      itemsSlctd={2}
      onListUpdated={handleListUpdate()}
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
            backgroundColor={woo_white}
            keyExtractor={(woo) => woo.id}
            numColumns={2}
            data={filteredResults}
            renderItem={renderGrid}
          />
        );

      case "preview":
        return (
          <FlatList
            showsVerticalScrollIndicator={false}
            key={(woo) => woo.id}
            scrollEnabled={false}
            backgroundColor={woo_white}
            keyExtractor={(woo) => woo.id}
            data={filteredResults}
            renderItem={renderPreview}
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

  return (
    <View>
      {view == "grid" && (
        <SearchInput
          data={wooList}
          onResultsChange={setFilteredResults}
          showEmptyMessage={true}
          placeholder="search woo list"
        />
      )}

      {/* {renderView(view)} */}
      <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            backgroundColor={"#fff"}
            data={wooList}
            renderItem={renderHorizontal}
          />
      {view == "grid" && (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Button
            onPress={() => setItemsSlctd((prev) => prev + 1)}
            title="update list"
            buttonStyle={{
              backgroundColor: woo_orange,
              borderRadius: 3,
            }}
            containerStyle={{
              width: 220,
              marginTop: 20,
              marginBottom: 30,
            }}
          />
        </View>
      )}
    </View>
  );
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
