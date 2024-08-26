import React, { useEffect } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import LayoutGalleryWooItem from "./LayoutGalleryWooItem";


const ListViewGalleryWoo = ({ uid, woos, kind, wooMedia, size, isTrunc, truncText, nav, navParams, horizBorderRadius = 25, gridNumOfColumns = 3 }) => {



    const renderGalleryPreview = (woo) => (
        
        <LayoutGalleryWooItem woo={woo} uid={uid} wooID={woo.id} size={size} kind={kind} wooMedia={wooMedia} nav={nav} navParams={navParams} horizBorderRadius={horizBorderRadius} />
    )

    useEffect(() => {
        console.log(`LVG WOOS === ${JSON.stringify(woos)}`)
    })

    return (
        <View style={styles.container}>
            <FlatList
                showsVerticalScrollIndicator={false}
                key={woo => woo.id}
                style={styles.gridViewFlatList}
                backgroundColor={"#fff"}
                keyExtractor={woo => woo.id}
                data={woos}
                renderItem={renderGalleryPreview}
                numColumns={gridNumOfColumns} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row"
    }
})

export default ListViewGalleryWoo;