import React, { useEffect, useState } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback, View, StyleSheet, Text, Image, FlatList, Alert } from 'react-native';
import { Card } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import ListViewChips from './ListViewChips';


const LayoutWooList = ({ nav, chips, wooType, wooID }) => {
    const navigation = useNavigation();

    useEffect(() => {
        console.log(chips)
    })

    return (
        <View>
            {
                chips.length > 0 ?
                    <Card containerStyle={styles.container}>
                        <View style={styles.wooListContainer}>
                            <ListViewChips wooID={wooID} nav={nav} chips={chips} view={'horizontal'} />
                        </View>
                    </Card>
                    :
                    < Card containerStyle={styles.textContainer}>
                        <Text style={styles.text}>no woo list</Text>
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
    wooListContainer: {
        justifyContent: 'space-between',
        // backgroundColor: 'red',
        flexDirection: 'row',
    },
    textContainer: {
        width: '100%',
        borderRadius: 5,
        margin: 0,
        paddingHorizontal: 5,
        paddingVertical: 5,
        alignItems: 'center'
    },
    text: {
        margin: 10
    }
})

export default LayoutWooList;