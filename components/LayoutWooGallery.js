import React from 'react'
import { View, StyleSheet } from 'react-native';
import { Gallery } from './shared';
import ListViewGallery from './ListViewGallery';

const LayoutWooGallery = () => {

    return (
        < View style={styles.container}>
            <ListViewGallery gallery={Gallery} view="horizontal" size="med" horizBorderRadius={5}/>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: .7,
    }
})

export default LayoutWooGallery;