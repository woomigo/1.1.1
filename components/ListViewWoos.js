import React, { useState } from "react";
import { View, StyleSheet, FlatList, RefreshControl, Switch } from "react-native";
import { Icon } from "@rneui/themed";
import LayoutWooItem from "./LayoutWooItem";
import { woo_orange, woo_white } from "../assets/colors";




const ListViewWoos = ({ woos, view }) => {

    const [currentVisibleIndex, setCurrentVisibleIndex] = useState();
    const [refreshing, setRefreshing] = React.useState(false);
    const [stateGridView, setStateGridView] = useState(false);

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);

    const onViewRef = React.useRef((viewableItems) => {
        if (viewableItems && viewableItems.length > 0) {
            setCurrentVisibleIndex(viewableItems[0].index);
        }
    })

    const renderView = (view) => {
        switch (view) {
            case 'list':
                return <FlatList
                    showsVerticalScrollIndicator={false}
                    key={woo => woo.id}
                    backgroundColor={woo_orange}
                    keyExtractor={woo => woo.id}
                    data={woos}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            progressBackgroundColor={woo_white}
                            tintColor={woo_white}
                        />
                    }
                    initialNumToRender={3}
                    onViewableItemsChanged={onViewRef.current}
                    renderItem={woo => <LayoutWooItem woo={woo} />}
                />
            case 'gallery':
                return <FlatList
                    showsVerticalScrollIndicator={false}
                    key={woo => woo.id}
                    backgroundColor={woo_orange}
                    keyExtractor={woo => woo.id}
                    data={woos}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            progressBackgroundColor={woo_white}
                            tintColor={woo_white}
                        />
                    }
                    initialNumToRender={3}
                    onViewableItemsChanged={onViewRef.current}
                    renderItem={woo => <LayoutWooItem woo={woo} isGalleryView />}
                />

            default:
                return '';
        }
    }

    return (
        <View style={styles.container}>
            {renderView(view)}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: "#fff"
    },
})

export default ListViewWoos;