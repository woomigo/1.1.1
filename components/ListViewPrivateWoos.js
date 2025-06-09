import React, { useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { woo_white } from "../assets/colors";
import LayoutPrivateWoos from "./LayoutPrivateWoos";

const ListViewPrivateWoos = ({ gallery, isVisible }) => {
  const [refreshing, setRefreshing] = useState(false);

  const renderGallery = (woo) => (
    <LayoutPrivateWoos woo={woo} isRead={woo.item.seen} isVisible={isVisible} />
  );

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        key={(woo) => woo.id}
        keyExtractor={(woo) => woo.id}
        showsHorizontalScrollIndicator={false}
        style={styles.wooGalleryPreviewList}
        backgroundColor={"#fff"}
        data={gallery}
        renderItem={renderGallery}
      />
      ;
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: woo_white,
  },
});

export default ListViewPrivateWoos;