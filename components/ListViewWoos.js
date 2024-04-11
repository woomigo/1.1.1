import React, { useState } from "react";
import { View, StyleSheet, FlatList, RefreshControl, Switch } from "react-native";
import { Icon } from "@rneui/themed";
import LayoutWooItem from "./LayoutWooItem";




const ListViewWoos = ({ woos, isGridView, showGridToggle }) => {

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

    return (
        <View style={styles.container}>

                    <FlatList
                        style={stateGridView ? styles.gridViewFlatList : ""}
                        showsVerticalScrollIndicator={false}
                        key={woo => woo.id}
                        backgroundColor={showGridToggle ? stateGridView ? "#fff" : "#f37320" : isGridView ? "#fff" : "#f37320"}
                        keyExtractor={woo => woo.id}
                        data={woos}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                progressBackgroundColor={"#fff"}
                                tintColor={"#fff"}
                            />
                        }
                        initialNumToRender={3}
                        onViewableItemsChanged={onViewRef.current}
                        renderItem={woo => <LayoutWooItem isGridView={isGridView} woo={woo} />}
                    />
                 

                    <FlatList
                        showsVerticalScrollIndicator={false}
                        key={woo => woo.id}                        style={styles.gridViewFlatList}
                        backgroundColor={"#fff"}
                        keyExtractor={woo => woo.id}
                        data={woos}
                        renderItem={woo => <LayoutWooItem isGridView={isGridView} woo={woo} />}
                        numColumns={2} />


                    <FlatList
                        showsVerticalScrollIndicator={false}
                        key={woo => woo.id}
                        backgroundColor={showGridToggle ? stateGridView ? "#fff" : "#f37320" : isGridView ? "#fff" : "#f37320"}
                        keyExtractor={woo => woo.id}
                        data={woos}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                progressBackgroundColor={"#fff"}
                                tintColor={"#fff"}
                            />
                        }
                        initialNumToRender={3}
                        onViewableItemsChanged={onViewRef.current}
                        renderItem={woo => <LayoutWooItem isGridView={isGridView} woo={woo} />}
                    />
                        

                        <FlatList
                            showsVerticalScrollIndicator={false}
                            key={woo => woo.id}
                            style={styles.gridViewFlatList}
                            backgroundColor={"#fff"}
                            keyExtractor={woo => woo.id}
                            data={woos}
                            renderItem={woo => <LayoutWooItem isGridView={isGridView} woo={woo} />}
                            numColumns={2} />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: "#fff"
    },
    gridViewFlatList: {
        padding: 10
    },
    profileViewSwitchContainer: {
        backgroundColor: '#fff',
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    profileViewSwitch: {
        marginStart: 15,
        marginEnd: 15,
        transform: [{ scaleX: .7 }, { scaleY: .7 }]
    },
})

export default ListViewWoos;