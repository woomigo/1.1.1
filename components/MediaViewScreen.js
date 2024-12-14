import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native"
import { Header, Icon } from "@rneui/themed";
import { woo_black, woo_white } from "../assets/colors";
import LayoutWooLike from "./LayoutWooLike";
import LayoutWooShowComment from "./LayoutWooShowComment";

const MediaViewScreen = ({ route, navigation }) => {

    const { mediaUrl } = route.params;

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
                            navigation.goBack()
                        }
                    />}
                // centerComponent={
                // }
                // rightComponent={
                // }
                rightContainerStyle={styles.rightComponent}
                leftContainerStyle={styles.leftComponent}
                centerContainerStyle={styles.centerComponent}
            />
            <Image
                style={{width: '100%', height: 600, borderRadius: 25}}
                source={{ uri: mediaUrl }}
            />

            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: woo_white,
        padding: 5
        // justifyContent: 'center',
        // alignItems: 'center'
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

export default MediaViewScreen;