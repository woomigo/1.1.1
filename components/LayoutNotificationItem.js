import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert, Image } from 'react-native';
import { Avatar, Icon } from "@rneui/themed"
import { woo_gray, woo_light_gray, woo_orange, woo_white } from '../assets/colors';
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from '../firebaseConfig';
// import { Swipeable } from 'react-native-gesture-handler';

const LayoutNotificationItem = ({ notification }) => {
    const [username, setUsername] = useState()
    const [setNotificationID, notificationID] = useState()
    const [lastName, setLastName] = useState()
    const [profilePicURL, setProfilePicURL] = useState()

    useEffect(() => {

        // setNotificationID(notification.item.id)
        console.log("LNI ---- " + notification.item.id)

        const docRef = doc(db, "users", notification.item.data().owner_uid);
        const getProfileInfo = onSnapshot(docRef, (doc) => {
            // console.log("Document data:", doc.data());
            setUsername(doc.data().username)
            setProfilePicURL(doc.data().profile_pic_url)
        }, (error) => {

        })

        return () => {
            getProfileInfo()
        }
    }, [])

    const confirmDeleteAlert = () =>
        Alert.alert(
            "Delete Notification",
            "Are you sure you want to delete this notification?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => console.log("Delete Pressed"), style: 'destructive' }
            ]
        );

    const renderRightActions = (progress, dragX) => {
        const trans = dragX.interpolate({
            inputRange: [0, 50, 100, 101],
            outputRange: [-20, 0, 0, 1],
        });

        return (
            <View>
                <TouchableOpacity
                    style={styles.deleteTouchable}
                    onPress={confirmDeleteAlert}
                >
                    <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        // <Swipeable style={styles.swipeRow} renderRightActions={renderRightActions} >
        <View>
            <TouchableOpacity
                onPress={() => console.log('notification')}
                style={[styles.container, !notification.item.data().is_read && { backgroundColor: woo_light_gray }]}
            >
                <View style={{ flex: 4, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.avatarContainer}>
                        <Avatar
                            rounded
                            size="small"
                            source={{ uri: `${profilePicURL}` }}
                        />
                    </View>
                    <View style={styles.notificationContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.username}>{`@${username}`} </Text>
                            <Text style={styles.notification}>{notification.item.data().notification_message}</Text>
                        </View>

                        <Text style={styles.time}>{new Date(notification.item.data().timestamp * 1000).toLocaleTimeString()}</Text>
                    </View>
                </View>

                <View style={styles.iconContainer}>
                    <Icon
                        name="heart"
                        type='font-awesome-5'
                        solid={true}
                        color={woo_orange}
                        size={25}
                    // onPress={confirmClearNotifications}
                    />
                </View>
            </TouchableOpacity>
        </View>

        // </Swipeable>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
    },
    avatarContainer: {
        marginStart: 5
    },
    iconContainer: {
        flex: 1,
        alignItems: 'flex-end',
        marginEnd: 18
    },
    notificationContainer: {
        marginStart: 5
    },
    username: {
        fontWeight: 'bold'
    },
    notification: {
        fontSize: 12,
    },
    time: {
        fontSize: 10
    },
    deleteView: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flex: 1
    },
    deleteTouchable: {
        backgroundColor: 'red',
        height: '100%',
        justifyContent: 'center'
    },
    deleteText: {
        color: 'white',
        fontWeight: '700',
        textAlign: 'center',
        fontSize: 16,
        width: 100
    }
})

export default LayoutNotificationItem;