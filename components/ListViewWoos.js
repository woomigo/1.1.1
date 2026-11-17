import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import LayoutWooItem from "./LayoutWooItem";
import { woo_gray, woo_light_gray, woo_orange } from "../assets/colors";

const ListViewWoos = ({ woos, view, uid, scrollEnabled = false, token }) => {
  useEffect(() => {
    // console.log(`LISTVIEWWOOS ==== ${JSON.stringify(woos[0])}`);
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
            scrollEnabled={scrollEnabled}
            showsVerticalScrollIndicator={false}
            key={(woo) => woo.id}
            backgroundColor={woo_light_gray}
            keyExtractor={(woo) => woo.id}
            style={{ height: "100%", width: "100%" }}
            data={woos}
            onViewableItemsChanged={onViewRef.current}
            renderItem={(woo) => <LayoutWooItem woo={woo} uid={uid} token={token} />}
          />
        );
      case "gallery":
        return (
          <FlatList
            showsVerticalScrollIndicator={false}
            key={(woo) => woo.id}
            backgroundColor={woo_light_gray}
            keyExtractor={(woo) => woo.id}
            data={woos}
            onViewableItemsChanged={onViewRef.current}
            renderItem={(woo) => <LayoutWooItem woo={woo} isGalleryView token={token} />}
          />
        );
      default:
        return "";
    }
  };

  return <View>{renderView(view)}</View>;
};

export default ListViewWoos;
