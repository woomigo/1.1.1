import React from 'react';
import { View, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LayoutWooImage = ({ wooID, image }) => {
    const navigation = useNavigation();

    return (
        <TouchableWithoutFeedback
            onPress={() =>
                navigation.navigate('Woo', { wooID: wooID })
            } style={styles.container}>
            <Image style={styles.image} source={{ uri: image }} />
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 8,
    }, image: {
        height: 500,
        width: '100%',
        borderRadius: 5,
    }
})

export default LayoutWooImage;