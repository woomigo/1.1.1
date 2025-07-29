import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Button, ListItem } from "@rneui/themed";
import LayoutWooListItem from "./LayoutWooListItem";
import { woo_orange, woo_white } from "../assets/colors";
import SearchInput from "./SearchInput";
import LayoutGroupItem from "./LayoutGroupItem";

const ListViewGroupList = ({ groups, view, size, wooID }) => {
  const [filteredResults, setFilteredResults] = useState(groups);
  const [itemsAmt, setItemsAmt] = useState(5);
  const [itemsSlctd, setItemsSlctd] = useState(2);

  useEffect(() => {
    console.log(`groups ==== ${JSON.stringify(groups)}`);
  });

  <SearchInput
    data={groups}
    onResultsChange={setFilteredResults}
    showEmptyMessage={true}
    placeholder="search woo list"
  />;

  const renderItem = (item) => <LayoutGroupItem item={item.item} />;

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        key={(woo) => woo.id}
        scrollEnabled={false}
        backgroundColor={woo_white}
        keyExtractor={(woo) => woo.id}
        data={groups}
        numColumns={2}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10
  },
});

export default ListViewGroupList;
