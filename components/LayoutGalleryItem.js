import React, { useEffect } from 'react';
import { View, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LayoutWooLocation from './LayoutWooLocation';


const LayoutGalleryItem = ({ image, view, size, nav, navParams, horizBorderRadius }) => {

    useEffect(() => {
       
    })
    const navigation = useNavigation();

    const setHorizontalSize = () => {
        switch (size) {
            case 'med':
                return 40;
            case 'lrg':
                return 60;
            case 'xlrg':
                return 80;
            case 'carousel':
                return '100%';
            case 'small':
            default:
                return 25;
        }
    }

    return (
        <View style={view === 'grid' ? styles.gridContainer : styles.container}>
            <TouchableWithoutFeedback
                onPress={() => {
                    navigation.navigate(`${nav}`
                        // , `${navParams}`
                    )
                }}>
                <Image
                    style={view === "horizontal" ? [styles.horizontalImage, { width: setHorizontalSize(), height: setHorizontalSize(), borderRadius: horizBorderRadius }] : view === "grid" ? styles.gridImage : styles.listImage}
                    source={{ uri: image }}
                />
            </TouchableWithoutFeedback>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // margin: 10
        // backgroundColor: 'red'
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

export default LayoutGalleryItem;