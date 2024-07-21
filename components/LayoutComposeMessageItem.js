import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Header, Icon, SearchBar, Avatar } from "@rneui/themed";
import { woo_gray, woo_orange, woo_white } from '../assets/colors';

const LayoutComposeMessageItem = ({ uid, receiversUID, message, profilePic, username, time, messageId }) => {

    const [createdAt, setCreatedAt] = useState()

    useEffect(() => {
        console.log(`LCMI ===== ${receiversUID} ${uid}`)
        setCreatedAt(new Date(time * 1000).toLocaleTimeString())
    })

    return (
        <View style={{ marginTop: 10, flexDirection: uid == receiversUID ? 'row' : 'row-reverse', marginStart: uid == receiversUID ? 10 : 150, marginEnd: uid == receiversUID ? 150 : 10, }}>
            <View style={{ backgroundColor: uid == receiversUID ? woo_gray : woo_orange, alignSelf: 'baseline', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 25 }}>
                <View style={{ justifyContent: 'center' }}>
                    <Text style={{ fontSize: 14, color: woo_white }}>{message}</Text>
                </View>
                <View>
                    <Text style={{ fontSize: 10, color: woo_white }}>{createdAt}</Text>
                </View>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {

    }
})

export default LayoutComposeMessageItem