import React from 'react'
import { View, StyleSheet } from 'react-native';
import { Gallery } from './shared';
import ListViewGallery from './ListViewGallery';

const LayoutWooGallery = ({gallery, nav}) => {

    return (
        < View style={styles.container}>
            <ListViewGallery nav={nav} gallery={Gallery} view="horizontal" size="med" horizBorderRadius={5}/>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: .7,
    }
})

export default LayoutWooGallery;