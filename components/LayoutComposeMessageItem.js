import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Header, Icon, SearchBar, Avatar } from "@rneui/themed";
import { woo_black, woo_gray, woo_orange, woo_white } from '../assets/colors';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

const LayoutComposeMessageItem = ({ uid, receiversUID, message, profilePic, username, time, messageId }) => {

    const [createdAt, setCreatedAt] = useState()

    useEffect(() => {
        console.log(`LCMI ===== ${receiversUID} ${uid}`)
        setCreatedAt(new Date(time * 1000).toLocaleTimeString())
    })
    const renderRightActions = (progress, dragX) => {
        const trans = dragX.interpolate({
            inputRange: [0, 50, 100, 101],
            outputRange: [0, 0, 0, 0],
        });
        return (
            <View style={{ justifyContent: 'flex-end', alignItems: 'center', }}>
                <Text style={{ fontSize: 10, color: woo_black }}>{createdAt}</Text>
            </View>
        );
    };

    const renderLeftActions = (progress, dragX) => {
        const trans = dragX.interpolate({
            inputRange: [0, 50, 100, 101],
            outputRange: [0, 0, 0, 0],
        });
        return (
            <View style={{ justifyContent: 'flex-end', alignItems: 'center', }}>
                <Text style={{ fontSize: 10, color: woo_black }}>{createdAt}</Text>
            </View>
        );
    }

    return (
        <GestureHandlerRootView>
            {uid == receiversUID ?
                <Swipeable style={styles.swipeRow} renderLeftActions={renderLeftActions}  >
                    <View style={{ marginTop: 10, flexDirection: 'row', marginStart: 10, marginEnd: 150 }}>
                        <View style={{ backgroundColor: uid == receiversUID ? woo_gray : woo_orange, alignSelf: 'baseline', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 25 }}>
                            <View style={{ justifyContent: 'center' }}>
                                <Text style={{ fontSize: 14, color: woo_white }}>{message}</Text>
                            </View>
                        </View>
                    </View>
                </Swipeable>
                :
                <Swipeable style={styles.swipeRow} renderRightActions={renderRightActions}>
                    <View style={{ marginTop: 10, flexDirection: 'row-reverse', marginStart: 150, marginEnd: 10, }}>
                        <View style={{ backgroundColor: uid == receiversUID ? woo_gray : woo_orange, alignSelf: 'baseline', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 25 }}>
                            <View style={{ justifyContent: 'center' }}>
                                <Text style={{ fontSize: 14, color: woo_white }}>{message}</Text>
                            </View>
                        </View>
                    </View>
                </Swipeable>
            }
        </GestureHandlerRootView>

    )
}

const styles = StyleSheet.create({
    container: {

    }
})

export default LayoutComposeMessageItem