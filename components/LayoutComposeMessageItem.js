import React, { useEffect } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Header, Icon, SearchBar, Avatar } from "@rneui/themed";

const LayoutComposeMessageItem = ({ uid, receiversUID="9849", message, profilePic, username, time, messageId }) => {

    useEffect(() => {
        console.log(`LCMI ===== `)
    })

    return (
        <View style={styles.container}>
            <View style={{ flex: 1, flexDirection: uid == receiversUID ? 'row-reverse' : 'row' }}>
                <View style={{ margin: 5 }}>
                    <Avatar
                        rounded
                        size="small"
                        onPress={() =>
                            navigate('Profile')
                        }
                        source={{ uri: profilePic }}
                    />
                </View>
                <View style={{ margin: 5, justifyContent: 'center' }}>
                    <Text>{message}</Text>
                </View>
            </View>
            <View style={{ margin: 5, flexDirection: uid == receiversUID ? 'row-reverse' : 'row', fontSize: 8 }}>
                <Text style={{ fontSize: 10 }}>{time}</Text>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20
    }
})

export default LayoutComposeMessageItem