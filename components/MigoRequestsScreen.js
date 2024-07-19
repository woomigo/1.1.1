import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from "react-native";
import { Header, Icon, Tab, TabView } from "@rneui/themed";
import { collection, query, where, getDocs, updateDoc, arrayUnion, doc, arrayRemove, onSnapshot } from "firebase/firestore";
import { db } from '../firebaseConfig';
import ListViewUsers from './ListViewUsers';
import { woo_black, woo_orange, woo_red } from '../assets/colors';

const MigoRequestScreen = ({ navigation, route }) => {

    const { uid } = route.params;
    const userRef = doc(db, "users", uid);

    const [index, setIndex] = useState(0);
    const [sentRequests, setSentRequests] = useState()
    const [receivedRequests, setReceivedRequests] = useState()
    const [user, setUser] = useState()

    useEffect(() => {
        const docRef = doc(db, "users", uid);
        const getMigoRequests = onSnapshot(docRef, (doc) => {
            // console.log("Document data:", doc.data());
            setUser(doc.data())
            setSentRequests(doc.data().sent_migo_requests)
            setReceivedRequests(doc.data().received_migo_requests)
        })

        return () => {
            getMigoRequests()
        };
    }, [])

    const removeUIDFromOwnerSent = async (userUID) => {
        await updateDoc(userRef, {
            sent_migo_requests: arrayRemove(userUID)
        });
    }

    const removeUIDFromUserSent = async (userUID) => {
        await updateDoc(doc(db, 'users', userUID), {
            sent_migo_requests: arrayRemove(uid)
        });
        // setView("migoRequestSuccess")
    }

    const removeUIDFromOwnerReceived = async (userUID) => {
        await updateDoc(userRef, {
            received_migo_requests: arrayRemove(userUID)
        });
    }

    const removeUIDFromUserReceived = async (userUID) => {
        await updateDoc(doc(db, 'users', userUID), {
            received_migo_requests: arrayRemove(uid)
        });
        // setView("migoRequestSuccess")
    }

    const handleFollowUser = (user) => {
        console.log(`FOLLOW!!!! ${user.username}`)
        // setView("loading")
        addUIDToOwnerFollowers(user.uid)
        addUIDToUserFollowing(user.uid)
    }

    const handleAddMigo = (user) => {
        // setView("loading")
        addUIDToOwnerMigos(user.uid)
        addUIDToUserMigos(user.uid)
        removeUIDFromUserFollowing(user.uid)
        removeUIDFromOwnerFollowers(user.uid)
    }

    const addUIDToOwnerFollowers = async (userUID) => {
        await updateDoc(userRef, {
            followers: arrayUnion(userUID)
        });
    }

    const addUIDToUserFollowing = async (userUID) => {
        await updateDoc(doc(db, "users", userUID), {
            following: arrayUnion(uid)
        })
        // setView("success")
    }


    const addUIDToOwnerMigos = async (userUID) => {
        console.log("ADD UID TO OWNER MIGOS")
        await updateDoc(userRef, {
            migos: arrayUnion(userUID)
        });
    }

    const addUIDToUserMigos = async (userUID) => {
        console.log("ADD UID TO USER MIGOS")
        await updateDoc(doc(db, 'users', userUID), {
            migos: arrayUnion(uid)
        });
        // setView("migoRequestSuccess")
    }


    const removeUIDFromUserFollowing = async (userUID) => {
        console.log("REMOVE UID FROM USER FOLLOWING")
        await updateDoc(doc(db, "users", userUID), {
            following: arrayRemove(uid)
        })
    }

    const removeUIDFromOwnerFollowers = async (userUID) => {
        console.log("REMOVE UID FROM OWNER FOLLOWERS")
        await updateDoc(userRef, {
            followers: arrayRemove(userUID)
        })
    }

    const handleDelete = (user) => {
        removeUIDFromOwnerSent(user.uid)
        removeUIDFromUserReceived(user.uid)
        console.log("DELETE " + user)
    }

    const handleAccept = (user) => {

        if (user.following.includes(uid)) {
            handleAddMigo(user)
            console.log("MIGOS MIGO REQUESTS")
        }
        else {
            handleFollowUser(user)
            console.log("ACCEPT CLICKED")
        }
        removeUIDFromUserSent(user.uid)
        removeUIDFromOwnerReceived(user.uid)
        console.log("Accept " + user.uid)
    }

    const handleIgnore = (user) => {
        removeUIDFromUserSent(user.uid)
        removeUIDFromOwnerReceived(user.uid)
        console.log("IGNORE " + user.uid)
    }

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
                            navigation.navigate('Migos')
                        }
                    />}
                centerComponent={
                    <View >
                        <Text style={{ fontSize: 25, color: woo_black, textAlign: 'center', fontWeight: 'bold' }}>migo requests</Text>
                    </View>
                }
                // rightComponent={

                // }
                rightContainerStyle={styles.rightComponent}
                leftContainerStyle={styles.leftComponent}
                centerContainerStyle={styles.centerComponent}
            />

            <Tab
                value={index}
                onChange={(e) => setIndex(e)}
                indicatorStyle={{
                    backgroundColor: '#f37320',
                    height: 3,
                }}
                containerStyle={{
                    backgroundColor: "white"
                }}
            >
                <Tab.Item
                    title="sent requests"
                    titleStyle={{ fontSize: 12, color: woo_black }}
                    icon={{ name: 'user-cog', type: 'font-awesome-5', color: woo_orange }}
                />
                <Tab.Item
                    title="received requests"
                    titleStyle={{ fontSize: 12, color: woo_black }}
                    icon={{ name: 'user-check', type: 'font-awesome-5', color: woo_orange }}
                />
            </Tab>
            <TabView value={index} onChange={setIndex} animationType="spring">
                <TabView.Item style={{ width: '100%' }}>
                    <View style={styles.tabHeader}>
                        <Text style={styles.tabText}>sent</Text>
                        <ListViewUsers users={sentRequests} kind="single" hideSearchBar singleBtnText='delete' singleBtnColor={woo_red} handleSingleBtnOnClick={(uid) => handleDelete(uid)} />
                    </View>
                </TabView.Item>
                <TabView.Item style={{ width: '100%' }}>
                    <View style={styles.tabHeader}>
                        <Text style={styles.tabText}>received</Text>
                        <ListViewUsers users={receivedRequests} kind="double" hideSearchBar doubleBtn1Text='accept' doubleBtn2Text='ignore' handleDoubleBtnOneOnClick={(uid) => handleAccept(uid)} handleDoubleBtnTwoOnClick={(uid) => handleIgnore(uid)} />
                    </View>
                </TabView.Item>
            </TabView>
        </View>


    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    profileInfo: {
        textAlign: 'center'
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
    tabHeader: {
        marginTop: 10,
        padding: 5,
        // alignItems: 'center'
    },
    tabText: {
        fontSize: 18,
        color: woo_black,
        fontWeight: 'bold',
        textAlign: 'center'
    }
})

export default MigoRequestScreen