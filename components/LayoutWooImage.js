import React from 'react';
import { View, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LayoutWooImage = ({ wooID, image, isPreview }) => {
    const navigation = useNavigation();

    return (
        <TouchableWithoutFeedback
            onPress={() => !isPreview ?
                navigation.navigate('Woo', { wooID: wooID }) : console.log('PREVIEW')
            } 
            style={styles.container}>
            <Image style={styles.image} source={!isPreview ? { uri: image } : image} />
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 8,
    }, image: {
        backgroundColor: "#d9d9d9",
        height: 500,
        // width: '100%',
        borderRadius: 25,
        margin: 10
    }
})

export default LayoutWooImage;