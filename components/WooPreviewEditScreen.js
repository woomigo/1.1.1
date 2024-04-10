import React, { useState } from 'react';
import { View, Text, StyleSheet } from "react-native";
import { Header, Icon, LinearProgress } from "@rneui/themed";
import { woo_black, woo_orange } from '../assets/colors';

const WooPreviewEditScreen = ({ route, navigation }) => {

    const { wooMedia, wooDate, wooTime, wooLocation, wooMigos, wooList } = route.params;

    const navigateToProfileAndClearStack = () => {
        navigation.popToTop();
        navigation.navigate('Profile')
    }

    return (
        <View style={styles.container}>
            <Header
                style={styles.header}
                backgroundColor={'#fff'}
                leftComponent={
                    <Icon
                        name="chevron-left"
                        type='font-awesome-5'
                        color={woo_black}
                        size={25}
                        onPress={() =>
                            navigation.navigate('WooList')
                        }
                    />}
                centerComponent={
                    <View >
                        <Text style={{ fontSize: 25, color: woo_black, textAlign: 'center', fontWeight: 'bold' }}>woo preview & edit</Text>
                    </View>
                }
                rightComponent={
                    <Icon
                        name="chevron-right"
                        type='font-awesome-5'
                        color={woo_black}
                        size={25}
                        onPress={() =>
                            navigateToProfileAndClearStack()
                        }
                    />
                }
                rightContainerStyle={styles.rightComponent}
                leftContainerStyle={styles.leftComponent}
                centerContainerStyle={styles.centerComponent}
            />
            <LinearProgress
                style={{}}
                value={1}
                color={woo_orange}
                variant="determinate"
            />

        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    profileInfo: {
        textAlign: 'center'
    },
    header: {
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 3 },
        shadowOpacity: 0.2,
        elevation: 4,
    },
    leftComponent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerComponent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightComponent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default WooPreviewEditScreen