import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import LayoutWooItem from "./LayoutWooItem";
import { woo_orange } from "../assets/colors";

const ListViewWoos = ({ woos, view, uid }) => {
  useEffect(() => {
    console.log(`LISTVIEWWOOS ==== ${JSON.stringify(woos[0])}`);
  });

  const [currentVisibleIndex, setCurrentVisibleIndex] = useState();
  const [refreshing, setRefreshing] = React.useState(false);
  const [stateGridView, setStateGridView] = useState(false);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const onViewRef = React.useRef((viewableItems) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentVisibleIndex(viewableItems[0].index);
    }
  });

  const renderView = (view) => {
    switch (view) {
      case "list":
        return (
          <FlatList
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            key={(woo) => woo.id}
            backgroundColor={woo_orange}
            keyExtractor={(woo) => woo.id}
            data={woos}
            // refreshControl={
            //     <RefreshControl
            //         refreshing={refreshing}
            //         onRefresh={onRefresh}
            //         progressBackgroundColor={woo_white}
            //         tintColor={woo_white}
            //     />
            // }
            // initialNumToRender={3}
            onViewableItemsChanged={onViewRef.current}
            renderItem={(woo) => <LayoutWooItem woo={woo} uid={uid} />}
          />
        );
      case "gallery":
        return (
          <FlatList
            showsVerticalScrollIndicator={false}
            key={(woo) => woo.id}
            backgroundColor={woo_orange}
            keyExtractor={(woo) => woo.id}
            data={woos}
            // refreshControl={
            //     <RefreshControl
            //         refreshing={refreshing}
            //         onRefresh={onRefresh}
            //         progressBackgroundColor={woo_white}
            //         tintColor={woo_white}
            //     />
            // }
            // initialNumToRender={3}
            onViewableItemsChanged={onViewRef.current}
            renderItem={(woo) => <LayoutWooItem woo={woo} isGalleryView />}
          />
        );
      default:
        return "";
    }
  };

  return <View>{renderView(view)}</View>;
};

export default ListViewWoos;
