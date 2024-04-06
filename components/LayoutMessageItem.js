import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { Avatar } from "@rneui/themed"
// import { Swipeable } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const LayoutMessageItem = ({ message }) => {
const navigation = useNavigation();
    const confirmDeleteAlert = () =>
    Alert.alert(
      "Delete Message",
      "Are you sure you want to delete this message?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => console.log("Delete Pressed"), style: "destructive" }
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

    // const renderLeftActions = (progress, dragX) => {
    //     const trans = dragX.interpolate({
    //         inputRange: [0, 50, 100, 101],
    //         outputRange: [-20, 0, 0, 1],
    //     });
    //     return (
    //         <View>
    //             <TouchableOpacity
    //                 style={styles.editTouchable}
    //                 onPress={() => console.log('edit')}
    //             >
    //                 <Text style={styles.editText}>Edit</Text>
    //             </TouchableOpacity>
    //         </View>
    //     );
    // };

    return (
        // <Swipeable style={styles.swipeRow} 
        // renderLeftActions={renderLeftActions} 
        // renderRightActions={renderRightActions} >
            <View>
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate('ComposeMessage',{receiversUID: [133,135]})}
                    style={styles.container}
                >
                    <View style={styles.imageContainer}>
                        <Avatar
                            rounded
                            size="small"
                            source={{ uri: `${message.item.profile}` }}
                        />
                    </View>
                    <View style={styles.messageContainer}>
                        <Text style={styles.username}>@{message.item.username}</Text>
                        <Text style={styles.message}>{message.item.message}</Text>
                    </View>
                    <View style={styles.timeContainer}>
                        <Text style={styles.time}>{message.item.time}</Text>
                    </View>
                </TouchableOpacity>
            </View>

        // </Swipeable>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: 'center',
        flexDirection: 'row',
        padding: 20,
    },
    imageContainer: {
        flex: 1,
        // backgroundColor:  'green'
    },
    messageContainer: {
        flex: 5,
        // backgroundColor:  'red'
    },
    timeContainer: {
        flex: 2,
        // backgroundColor: 'blue'
    },
    username: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    message: {

    },
    time: {

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
    },
    editTouchable: {
        backgroundColor: 'gray',
        height: '100%',
        justifyContent: 'center'
    },
    editText: {
        color: 'white',
        fontWeight: '700',
        textAlign: 'center',
        fontSize: 16,
        width: 100
    }
})

export default LayoutMessageItem;