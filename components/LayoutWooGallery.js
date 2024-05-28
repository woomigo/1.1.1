import React from 'react'
import { View, StyleSheet } from 'react-native';
import { Gallery } from './shared';
import { Card } from '@rneui/themed';
import ListViewGallery from './ListViewGallery';

const LayoutWooGallery = ({gallery, nav}) => {

    return (
        < Card containerStyle={styles.container}>
            <ListViewGallery nav={nav} gallery={Gallery} view="horizontal" size="med" horizBorderRadius={5}/>
        </Card >
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 5,
        margin: 0,
        paddingHorizontal: 5,
        paddingVertical: 5,
    }
})

export default LayoutWooGallery;