import React, { useState } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback, View, StyleSheet, Text, Image, FlatList, Alert } from 'react-native';
import { Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import ListViewChips from './ListViewChips';


const LayoutWooList = ({ chips, wooType }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.wooListContainer}>
            <ListViewChips chips={chips} view={'horizontal'} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: .7,
        paddingTop: 5,
        paddingBottom: 5,
        marginTop: 5
    },
    wooListContainer: {
        justifyContent: 'space-between',
        // backgroundColor: 'red',
        flexDirection: 'row',
    }
})

export default LayoutWooList;