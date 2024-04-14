import React, { useState, useEffect } from "react"; "@rneui/themed"
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from "react-native";
import { Header, Icon, Badge, Avatar, ButtonGroup } from "@rneui/themed";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from '../firebaseConfig';
import ListViewGallery from './ListViewGallery';
import ListViewWoos from "./ListViewWoos";
import { Gallery, UserWoos } from './shared';
import { woo_black, woo_gray, woo_orange } from "../assets/colors";

const HomeScreen = ({ navigation }) => {
    const [uid, setUID] = useState(null);
    const [notificationCount, setNotificationCount] = useState(0);
    const [migosNotificationCount, setMigosNotificationCount] = useState(0);
    const [messagesNotificationCount, setMessagesNotificationCount] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState(0);



    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user
            const uid = user.uid;
            setUID(user.uid)
            console.log(`HOME OASC UID === ${uid}`)
            // ...
        } else {
            // User is signed out
            // ...
        }
    });

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <ListViewGallery gallery={Gallery} view={"horizontal"} size="lrg" />

                <ListViewWoos view={'list'} woos={UserWoos}/>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF9F6'
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
    subHeader: {
        marginVertical: 10,
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
})

export default HomeScreen;