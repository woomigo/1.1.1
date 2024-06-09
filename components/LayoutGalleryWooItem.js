import React, { useEffect } from 'react';
import { View, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const LayoutGalleryWooItem = ({woo, nav, navParams }) => {
    const navigation = useNavigation();

    useEffect(() => {
        // console.log(`LVGI WOO === ${JSON.stringify(woo.item[1])}`)
        // console.log(`LVGI WOO ID === ${JSON.stringify(woo.item[0].id)}`)
    })

    return (
        <View style={styles.gridContainer}>
            <TouchableWithoutFeedback
                onPress={() => {
                    navigation.navigate(`${nav}`, `${navParams}`)
                }}>
                <Image
                    style={styles.gridImage}
                    source={{ uri: woo.item.woo_media_url }}
                />
            </TouchableWithoutFeedback>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    horizontalImage: {
        margin: 5
    },

    gridContainer: {
        flex: 1,
        height: 200,
        width: '100%',
        margin: 3
    },
    gridImage: {
        flex: 1,
        height: '100%',
        width: '100%',
        resizeMode: 'cover',
        borderRadius: 5
    },
    listImage: {
        width: '100%',
        height: 500,
        borderRadius: 5,
    }
})

export default LayoutGalleryWooItem;