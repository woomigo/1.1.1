import React, { useState } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback, View, StyleSheet, Text, Image, FlatList, Alert } from 'react-native';
import { Card } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import ListViewChips from './ListViewChips';


const LayoutWooList = ({ nav, chips, wooType }) => {
    const navigation = useNavigation();

    return (
        <Card containerStyle={styles.container}>
            <View style={styles.wooListContainer}>
                <ListViewChips nav={nav} chips={chips} view={'horizontal'} />
            </View>
        </Card>
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
    wooListContainer: {
        justifyContent: 'space-between',
        // backgroundColor: 'red',
        flexDirection: 'row',
    }
})

export default LayoutWooList;