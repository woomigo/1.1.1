import React, {useEffect} from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import LayoutGalleryItem from "./LayoutGalleryItem";


const ListViewGallery = ({ gallery, woos, view, size, isTrunc, truncText, nav, navParams, horizBorderRadius = 25, gridNumOfColumns = 3 }) => {

 

    const renderGalleryPreview = (image) => (
        <LayoutGalleryItem size={size} view={view} image={image.item.image} nav={nav} navParams={navParams} horizBorderRadius={horizBorderRadius} />
    )

    const renderView = (view) => {
        switch (view) {
            case 'list':
                return <FlatList
                    showsVerticalScrollIndicator={false}
                    key={woo => woo.id}
                    style={styles.gridViewFlatList}
                    backgroundColor={"#fff"}
                    keyExtractor={woo => woo.id}
                    data={gallery}
                    renderItem={renderGalleryPreview} />
            case 'grid':
                return <FlatList
                    showsVerticalScrollIndicator={false}
                    key={woo => woo.id}
                    style={styles.gridViewFlatList}
                    backgroundColor={"#fff"}
                    keyExtractor={woo => woo.id}
                    data={gallery}
                    renderItem={renderGalleryPreview}
                    numColumns={gridNumOfColumns} />;
            case 'horizontal':
                return <FlatList
                    horizontal
                    key={woo => woo.id}
                    showsHorizontalScrollIndicator={false}
                    style={styles.wooGalleryPreviewList}
                    backgroundColor={"#fff"}
                    data={gallery}
                    renderItem={renderGalleryPreview} />;
            default:
                return '';
        }
    }

    return (
        <View style={styles.container}>
            {renderView(view)}
            <View style={styles.truncTextContainer}>
                {isTrunc ? <Text style={styles.truncText}>{truncText}</Text> : null}
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row"
    },
    truncTextContainer: {
        justifyContent: "flex-end"
    },
    truncText: {
        fontSize: 12,
        textDecorationLine: 'underline',
        marginBottom: 10
    }
})

export default ListViewGallery;