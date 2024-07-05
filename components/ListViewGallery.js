import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text, RefreshControl } from "react-native";
import LayoutGalleryItem from "./LayoutGalleryItem";
import { woo_orange, woo_white } from "../assets/colors";


const ListViewGallery = ({ gallery, woos, view, size, isTrunc, truncText, nav, navParams, horizBorderRadius = 25, gridNumOfColumns = 3, inverted }) => {

    const [refreshing, setRefreshing] = useState(false);

    const renderGalleryPreview = (image) => (
        <LayoutGalleryItem size={size} view={view} image={image.item} nav={nav} navParams={navParams} horizBorderRadius={horizBorderRadius} />
    )

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);

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
                        style={{
                            height: "100%",
                            width: '100%',
                            backgroundColor: 'red',
                            flexGrow: 0
                          }}
                        backgroundColor={woo_white}
                        keyExtractor={woo => woo.id}
                        data={gallery}
                        // inverted={inverted}
                        // refreshControl={
                        //     <RefreshControl
                        //         refreshing={refreshing}
                        //         onRefresh={onRefresh}
                        //         progressBackgroundColor={woo_white}
                        //         tintColor={woo_white}
                        //     />
                        // }
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
        // flex: 1,
        flexDirection: "row",
        backgroundColor: woo_white

    },
    gridViewFlatList: {
        width: '100%',
        flexGrow: 0
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