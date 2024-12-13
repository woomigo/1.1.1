import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import LayoutChipItem from "./LayoutChipItem";


const ListViewChips = ({ chips, view, size, wooID }) => {



    const renderChipPreview = (chip) => (
        <LayoutChipItem size={size} view={view} chip={chip.item} wooID={wooID} />
    )

    const renderView = (view) => {
        switch (view) {
            case 'horizontal':
                return <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    backgroundColor={"#fff"}
                    data={chips}
                    renderItem={renderChipPreview} />;
            default:
                return <View style={styles.container}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        backgroundColor={"#fff"}
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