import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from "react-native";
import { Header, Icon, Tab, TabView } from "@rneui/themed";
import { Migos } from './shared';
import { collection, query, where, getDocs, updateDoc, arrayUnion, doc, arrayRemove, onSnapshot } from "firebase/firestore";
import { db } from '../firebaseConfig';
import ListViewUsers from './ListViewUsers';
import { woo_black, woo_gray, woo_orange, woo_red } from '../assets/colors';

const MigosScreen = ({ navigation, route }) => {

    const { uid } = route.params;

    const userRef = doc(db, "users", uid);

    const [index, setIndex] = useState(0);
    const [following, setFollowing] = useState()
    const [followers, setFollowers] = useState()
    const [migos, setMigos] = useState()
    const [user, setUser] = useState()

    useEffect(() => {
        const docRef = doc(db, "users", uid);
        const getMigos = onSnapshot(docRef, (doc) => {
            // console.log("Document data:", doc.data());
            setUser(doc.data())
            setFollowing(doc.data().following)
            setFollowers(doc.data().followers)
            setMigos(doc.data().migos)
        })

        return () => {
            getMigos()
        };
    }, [])

    const addUIDToUserFollowing = async (userUID) => {
        await updateDoc(doc(db, "users", userUID), {
            following: arrayUnion(uid)
        })
    }

    const addUIDToOwnerFollowers = async (userUID) => {
        await updateDoc(userRef, {
            followers: arrayUnion(userUID)
        })
        // setView("success")
    }

    const removeUIDFromUserFollowers = async (userUID) => {
        await updateDoc(doc(db, "users", userUID), {
            followers: arrayRemove(uid)
        })
    }

    const removeUIDFromUserFollowing = async (userUID) => {
        await updateDoc(doc(db, "users", userUID), {
            following: arrayRemove(uid)
        });
    }

    const removeUIDFromOwnerFollowers = async (userUID) => {
        await updateDoc(userRef, {
            followers: arrayRemove(userUID)
        });
    }

    const removeUIDFromOwnerFollowing = async (userUID) => {
        await updateDoc(userRef, {
            following: arrayRemove(userUID)
        });
    }

    const removeUIDFromOwnerMigos = async (userUID) => {
        await updateDoc(userRef, {
            migos: arrayRemove(userUID)
        });
    }

    const removeUIDFromUserMigos = async (userUID) => {
        await updateDoc(doc(db, 'users', userUID), {
            migos: arrayRemove(uid)
        });
        // setView("migoRequestSuccess")
    }

    const handleUnfollowMigo = (user) => {
        addUIDToOwnerFollowers(user.uid)
        addUIDToUserFollowing(user.uid)
        // removeUIDFromUserFollowers(user.uid)
        removeUIDFromUserMigos(user.uid)
        removeUIDFromOwnerMigos(user.uid)
        console.log("unfollow MIGO" + " " + user.uid)
    }

    const handleRemoveFollower = (user) => {
        removeUIDFromOwnerFollowers(user.uid)
        removeUIDFromUserFollowing(user.uid)
        console.log("remove Follower" + " " + user.uid)
    }

    const handleUnfollowFollowing = (user) => {
        removeUIDFromOwnerFollowing(user.uid)
        removeUIDFromUserFollowers(user.uid)
        console.log("unfollow Following" + " " + user.uid)
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
                            navigation.navigate('Profile')
                        }
                    />}
                centerComponent={
                    <View >
                        <Text style={{ fontSize: 25, color: woo_black, textAlign: 'center', fontWeight: 'bold' }}>migos</Text>
                    </View>
                }
                rightComponent={
                    <Icon
                        name="user-plus"
                        type='font-awesome-5'
                        color={woo_black}
                        size={25}
                        onPress={() =>
                            navigation.navigate('MigoRequests')
                        }
                    />
                }
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
                style={styles.tabContainer}
            >
                <Tab.Item
                    title="following"
                    titleStyle={{ fontSize: 12, color: woo_black }}
                    icon={{ name: 'user-friends', type: 'font-awesome-5', color: woo_orange }}
                />
                <Tab.Item
                    title="followers"
                    titleStyle={{ fontSize: 12, color: woo_black }}
                    icon={{ name: 'users', type: 'font-awesome-5', color: woo_orange }}
                />
                <Tab.Item
                    title="migos"
                    titleStyle={{ fontSize: 12, color: woo_black }}
                    icon={{ name: 'people-arrows', type: 'font-awesome-5', color: woo_orange }}
                />
            </Tab>
            <TabView value={index} onChange={setIndex} animationType="spring" style={{        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 4,
        marginTop: 5,
        marginBottom: 5,}}>
                <TabView.Item style={{ width: '100%' }}>
                    <View style={styles.tabHeader}>
                        <Text style={styles.tabText}>following</Text>
                        <ListViewUsers users={following} hideSearchBar searchBoxPlaceholder="search following by @username" kind="single" singleBtnColor={woo_gray} singleBtnText='unfollow' handleSingleBtnOnClick={(user) => handleUnfollowFollowing(user)} />
                    </View>
                </TabView.Item>
                <TabView.Item style={{ width: '100%' }}>
                    <View style={styles.tabHeader}>
                        <Text style={styles.tabText}>followers</Text>
                        <ListViewUsers users={followers} hideSearchBar searchBoxPlaceholder="search followers by @username" kind="single" singleBtnColor={woo_gray} singleBtnText='remove'  handleSingleBtnOnClick={(user) => handleRemoveFollower(user)}/>
                    </View>
                </TabView.Item>
                <TabView.Item style={{ width: '100%' }}>
                    <View style={styles.tabHeader}>
                        <Text style={styles.tabText}>migos</Text>
                        <ListViewUsers users={migos} hideSearchBar searchBoxPlaceholder="search migos by @username" kind="single" singleBtnColor={woo_gray} singleBtnText='unfollow' handleSingleBtnOnClick={(user) => handleUnfollowMigo(user)} />
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
    tabContainer: {

      },
    tabHeader: {
        marginTop: 10,
        // padding: 5,
        // alignItems: 'center'
    },
    tabText: {
        fontSize: 18,
        color: woo_black,
        fontWeight: 'bold',
        textAlign: 'center'
    }
})

export default MigosScreen