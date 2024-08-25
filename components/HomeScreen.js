import React, { useState, useEffect } from "react"; "@rneui/themed"
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from "react-native";
import { Header, Icon, Badge, Avatar, ButtonGroup } from "@rneui/themed";
import { auth, db } from '../firebaseConfig';
import ListViewGallery from './ListViewGallery';
import ListViewWoos from "./ListViewWoos";
import { Gallery, UserWoos } from './shared';
import { woo_black, woo_gray, woo_orange } from "../assets/colors";
import { where } from "firebase/firestore";

const HomeScreen = ({ navigation, route }) => {

    const { uid } = route.params;

    const [user, setUser] = useState()
    const [woos, setWoos] = useState([])
    const [gallery, setGallery] = useState([])
    const [username, setUsername] = useState()
    const [firstName, setFirstName] = useState()
    const [lastName, setLastName] = useState()
    const [profilePicURL, setProfilePicURL] = useState()
    const [following, setFollowing] = useState([])
    const [followers, setFollowers] = useState([])
    const [migos, setMigos] = useState([])
    const [migoWoos, setMigoWoos] = useState([])
    const [recSubWoos, setRecSubWoos] = useState([])
    const [notificationCount, setNotificationCount] = useState(0);
    const [migosNotificationCount, setMigosNotificationCount] = useState(0);
    const [messagesNotificationCount, setMessagesNotificationCount] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {

        const docRef = doc(db, "users", uid);
        const getProfileInfo = onSnapshot(docRef, (doc) => {
            setUser(doc.data())
            setGallery(doc.data().gallery)
            setUsername(doc.data().username)
            setFirstName(doc.data().first_name)
            setLastName(doc.data().last_name)
            setProfilePicURL(doc.data().profile_pic_url)
            setFollowing(doc.data().following)
            setFollowers(doc.data().followers)
            setMigos(doc.data().migos)
            setMigoWoos(doc.data().migo_woos)
        }, (error) => {

        })


        const q = query(collection(db, "woos"), where("woo_migos", "==", uid), where("woo_sub_migos", "==", uid));
        const getWoos = onSnapshot(q, (querySnapshot) => {
            const homeWoos = [];
            querySnapshot.forEach((doc) => {
                // console.log(doc.id)
                homeWoos.push(doc.data());
            });
            setWoos(homeWoos)
        }, (error) => {

        });

        return () => {
            getProfileInfo()
            getWoos()
        }
    }, [])

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <ListViewGallery gallery={Gallery} view={"horizontal"} size="lrg" />

                <ListViewWoos view={'list'} woos={UserWoos} />
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