import React from 'react'
import { View, StyleSheet, Text } from 'react-native';
import { Card } from '@rneui/themed';
import ListViewGallery from './ListViewGallery';

const LayoutWooGallery = ({ gallery, nav }) => {

    return (
        <View>
            {
                gallery.length > 0 ?
                    < Card containerStyle={styles.container}>
                        <ListViewGallery nav={nav} gallery={gallery} view="horizontal" size="xlrg" horizBorderRadius={5} />
                    </Card >
                    :
                    < Card containerStyle={styles.textContainer}>
                        <Text style={styles.text}>no woo gallery</Text>
                    </Card >
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 5,
        margin: 0,
        paddingHorizontal: 5,
        paddingVertical: 5,
    },
    textContainer: {
        width: '100%',
        borderRadius: 5,
        margin: 0,
        paddingHorizontal: 5,
        paddingVertical: 5,
        alignItems: 'center'
    },
    text:{
        margin: 10
    }
})

export default LayoutWooGallery;