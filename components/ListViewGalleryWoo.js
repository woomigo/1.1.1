import React, { useEffect } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import LayoutGalleryWooItem from "./LayoutGalleryWooItem";


const ListViewGalleryWoo = ({ gallery, woos, view, size, isTrunc, truncText, nav, navParams, horizBorderRadius = 25, gridNumOfColumns = 3 }) => {



    const renderGalleryPreview = (woo) => (
        
        <LayoutGalleryWooItem woo={woo} size={size} view={view} image={woo.item.woo_media_url} location={woo.item.woo_location} date={woo.item.woo_date} startTime={woo.item.woo_start_time} endTime={woo.item.woo_end_time} profilePic={woo.item.woo_owner_profile_pic} username={woo.item.woo_owner_username} nav={nav} navParams={navParams} horizBorderRadius={horizBorderRadius} />
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