import React from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import LayoutChipItem from "./LayoutChipItem";


const ListViewChips = ({ chips, view, size, nav, navParams }) => {



    const renderChipPreview = (chip) => (
        <LayoutChipItem size={size} view={view} chip={chip.item} nav={nav} navParams={navParams} />
    )

    const renderView = (view) => {
        switch (view) {
            case 'horizontal':
                return <FlatList
                    horizontal
                    // key={woo => woo.id}
                    showsHorizontalScrollIndicator={false}
                    // style={styles.wooGalleryPreviewList}
                    backgroundColor={"#fff"}
                    data={chips}
                    renderItem={renderChipPreview} />;
            default:
                return <View style={styles.container}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        // key={}
                        backgroundColor={"#fff"}
                        // keyExtractor={woo => woo.id}
                        data={chips}
                        renderItem={renderChipPreview} />
                </View>;
        }
    }

    return (
        renderView(view)
    )
}

const styles = StyleSheet.create({
    container: {
        // flexDirection: "row"
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

export default ListViewChips;