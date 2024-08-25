import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert} from 'react-native';
import { Avatar } from "@rneui/themed"
import { woo_gray, woo_light_gray, woo_white } from '../assets/colors';
// import { Swipeable } from 'react-native-gesture-handler';

const LayoutNotificationItem = ({ notification }) => {

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
                    onPress={console.log(() => 'notification')}
                    style={[styles.container, notification.item.unread && {backgroundColor: woo_light_gray}]}
                >
                    <View style={styles.imageContainer}>
                        <Avatar
                            rounded
                            size="small"
                            source={{ uri: `${notification.item.profile}` }}
                        />
                    </View>
                    <View style={styles.notificationContainer}>
                        <Text style={styles.notification}>{notification.item.notification}</Text>
                        <Text style={styles.time}>{notification.item.time}</Text>
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
        padding: 20,
    },
    imageContainer: {
        marginStart: 5
    },
    notificationContainer: {
        marginStart: 5
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