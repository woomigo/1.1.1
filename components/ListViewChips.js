import React from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import LayoutChipItem from "./LayoutChipItem";


const ListViewChips = ({ chips, view, size, isTrunc, truncText, nav, navParams, horizBorderRadius=25 }) => {



    const renderChipPreview = (image) => (
        <LayoutChipItem size={size} view={view} image={chip.item.chip} nav={nav} navParams={navParams} horizBorderRadius={horizBorderRadius} />
    )

    return (
        <View style={styles.container}>
            <FlatList
                    showsVerticalScrollIndicator={false}
                    key={woo => woo.id}
                    style={styles.gridViewFlatList}
                    backgroundColor={"#fff"}
                    keyExtractor={woo => woo.id}
                    data={chips}
                    renderItem={renderChipPreview} />
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

export default ListViewChips;