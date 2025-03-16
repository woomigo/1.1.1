import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { Avatar } from "@rneui/themed"
import { doc, getDoc, collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from '../firebaseConfig';
// import { Swipeable } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { woo_gray, woo_light_gray, woo_white } from '../assets/colors';

const LayoutMessageItem = ({ messager, uid }) => {

    const [user, setUser] = useState()
    const [messages, setMessages] = useState()
    const [time, setTime] = useState()

    // const { uid } = route.params;

    // class Message {
    //     constructor(message, timestamp) {
    //         this.message = message;
    //         this.timestamp = timestamp
    //     }
    // }

    // useEffect(() => {
    //     console.log(messager.item)
    // })

    // useEffect(() => {
    //     const docRef = doc(db, "users", messager.item);
    //     const getProfileInfo = onSnapshot(docRef, (doc) => {
    //         // console.log("Document data:", doc.data());
    //         setUser(doc.data())
    //         // setGallery(doc.data().gallery)
    //         // setUsername(doc.data().username)
    //         // setFirstName(doc.data().first_name)
    //         // setLastName(doc.data().last_name)
    //         // setProfilePicURL(doc.data().profile_pic_url)
    //         // setFollowing(doc.data().following)
    //         // setFollowers(doc.data().followers)
    //         // setMigos(doc.data().migos)
    //     }, (error) => {

    //     })

    //     const q = query(collection(db, "users", uid, "messages", messager.item, "messages"), orderBy("created_at", "desc"));
    //     const unsubscribe = onSnapshot(q, (querySnapshot) => {
    //         const arrayofMessages = [];
    //         querySnapshot.forEach((doc) => {
    //             console.log(doc.data())
    //             arrayofMessages.push(doc.data());
    //         });
    //         // console.log("Messages Owned by this USER: ", arrayofMessages.join(", "));
    //         setMessages(arrayofMessages)
    //         let dateTime = new Date(arrayofMessages[0].created_at * 1000)
    //         // let hours = dateTime.getHours()
    //         // let minutes = dateTime.getMinutes()
    //         setTime(`${dateTime.getMonth() + 1}/${+ dateTime.getDate()}, ${dateTime.toLocaleTimeString()}`);

    //     }, (error) => {

    //     });

    //     return () => {
    //         getProfileInfo()
    //         unsubscribe()
    //     };
    // }, [])


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
            {user && messages &&

                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate('Messages', { user: user })}
                    style={styles.container}
                >
                    <View style={styles.imageContainer}>
                        <Avatar
                            rounded
                            size="small"
                            source={{ uri: `${user.profile_pic_url}` }}
                        />
                    </View>
                    <View style={styles.messageContainer}>
                        <Text style={styles.username}>@{user.username}</Text>
                        <Text style={styles.message}>{messages[0].message}</Text>
                    </View>
                    <View style={styles.timeContainer}>
                        <Text style={styles.time}>{time}</Text>
                    </View>
                </TouchableOpacity>
            }
        </View>

        // </Swipeable>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: woo_white,
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
        alignItems: 'flex-end'
        // backgroundColor: 'blue'
    },
    username: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    message: {

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