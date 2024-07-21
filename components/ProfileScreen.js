import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Header, Icon, Avatar, Tab, TabView, Button } from "@rneui/themed";
import ListViewGallery from './ListViewGallery';
import ListViewGalleryWoo from './ListViewGalleryWoo';
import { Gallery } from './shared';
import { woo_black, woo_orange, woo_white } from '../assets/colors';
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from '../firebaseConfig';
import { Drawer } from 'react-native-drawer-layout';
import MenuScreen from './MenuScreen';

const ProfileScreen = ({ navigation, route }) => {

    const [index, setIndex] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);
    const [user, setUser] = useState()
    const [isProfileOwnedByUser, setIsProfileOwnedByUser] = useState(true);
    const [woos, setWoos] = useState([])
    const [gallery, setGallery] = useState([])
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState()
    const [firstName, setFirstName] = useState()
    const [lastName, setLastName] = useState()
    const [profilePicURL, setProfilePicURL] = useState()
    const [following, setFollowing] = useState([])
    const [followers, setFollowers] = useState([])
    const [migos, setMigos] = useState([])

    const { uid } = route.params;

    // const docRef = doc(db, "users", uid);
    // const getProfileInfo = async () => {

    // const docSnap = await getDoc(docRef);

    // if (docSnap.exists()) {
    //     // console.log("Document data:", docSnap.data());
    //     setGallery(docSnap.data().gallery)
    //     setUsername(docSnap.data().username)
    //     setFirstName(docSnap.data().first_name)
    //     setLastName(docSnap.data().last_name)
    //     setProfilePicURL(docSnap.data().profile_pic_url)
    // } else {
    //     // docSnap.data() will be undefined in this case
    //     // console.log("No such document!");
    // }
    // }

    useEffect(() => {
        const docRef = doc(db, "users", uid);
        const getProfileInfo = onSnapshot(docRef, (doc) => {
            // console.log("Document data:", doc.data());
            setUser(doc.data())
            setGallery(doc.data().gallery)
            setUsername(doc.data().username)
            setFirstName(doc.data().first_name)
            setLastName(doc.data().last_name)
            setProfilePicURL(doc.data().profile_pic_url)
            setFollowing(doc.data().following)
            setFollowers(doc.data().followers)
            setMigos(doc.data().migos)
        }, (error) => {

        })

        const q = query(collection(db, "woos"), where("owner_uid", "==", uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const ownedWoos = [];
            querySnapshot.forEach((doc) => {
                // console.log(doc.id)
                ownedWoos.push(doc.data());
            });
            // console.log("Woos Owned by this USER: ", ownedWoos.join(", "));
            setWoos(ownedWoos)
        }, (error) => {

        });

        return () => {
            getProfileInfo()
            unsubscribe()
        };
    }, [])

    return (
        <View style={styles.container}>
            <Drawer
                // drawerStyle={{ marginTop: 100 }}
                drawerPosition='right'
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                renderDrawerContent={() => {
                    return <MenuScreen user={user} />;
                }}
            >
                <Header
                    containerStyle={styles.header}
                    backgroundColor={woo_white}
                    leftComponent={

                        <Icon
                            name={isProfileOwnedByUser ? "users" : "bars"}
                            type='font-awesome-5'
                            color={woo_black}
                            solid
                            size={25}
                            onPress={isProfileOwnedByUser ? () =>
                                navigation.navigate('Migos', { followers: followers, following: following, migos: migos }) : "open drawer"
                            }
                        />

                    }
                    centerComponent={
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Avatar
                                rounded
                                size="medium"
                                onPress={() =>
                                    navigation.navigate('Profile')
                                }
                                source={{ uri: profilePicURL }}
                            />
                            <View>
                                {/* <Text style={{ color: woo_black, marginBottom: 3, textAlign: 'center',  }}>Deserae Harrison</Text> */}
                                <Text style={{ color: woo_black, marginBottom: 3, textAlign: 'center', fontWeight: 'bold' }}>{username}</Text>
                                <Text style={{ color: woo_black, marginBottom: 3, textAlign: 'center' }}>1,2345 migos</Text>
                            </View>

                        </View>
                    }
                    rightComponent={
                        <Icon
                            name={'bars'}
                            type='font-awesome-5'
                            color={woo_black}
                            solid
                            size={25}
                            onPress={() => setOpen((prevOpen) => !prevOpen)
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
                        backgroundColor: woo_orange,
                        height: 3,
                    }}
                    containerStyle={{
                        marginTop: 20,
                        backgroundColor: woo_white
                    }}
                >
                    {/* <Tab.Item
                    title="subscribed"
                    titleStyle={{ fontSize: 12, color: woo_black }}
                    icon={{ name: 'sign-in-alt', type: 'font-awesome-5', color: woo_black }}
                /> */}
                    <Tab.Item
                        title="woos"
                        titleStyle={{ fontSize: 12, color: woo_black }}
                        iconContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
                        icon={<Image style={{ width: 30, height: 24 }} source={require('../assets/woomigo_icon.png')} />}
                    />

                    <Tab.Item
                        title="gallery"
                        titleStyle={{ fontSize: 12, color: woo_black }}
                        icon={{ name: 'photo-video', type: 'font-awesome-5', color: woo_orange }}
                    />
                </Tab>
                <TabView value={index} onChange={setIndex} animationType="spring">
                    {/* <TabView.Item style={{ width: '100%' }}>
                    <View style={styles.tabHeader}>
                        <Text style={styles.tabText}>Published Woos</Text>
                        <ListViewWoos woos={UserWoos} isGridView />
                    </View>
                </TabView.Item> */}
                    <TabView.Item style={{ width: '100%', flex: 1 }}>
                        <View style={styles.tabHeader}>
                            <Text style={styles.tabText}>Woos</Text>
                            {woos &&
                                <ListViewGalleryWoo woos={woos} view={'grid'} gridNumOfColumns={2} />}
                        </View>
                    </TabView.Item>
                    <TabView.Item style={{ height: '100%', width: '100%' }}>
                        <View style={styles.tabHeader}>
                            <Text style={styles.tabText}>Gallery</Text>
                            <ListViewGallery gallery={gallery} inverted view={"grid"} nav={"MediaView"} />
                        </View>
                    </TabView.Item>
                </TabView>

            </Drawer>
        </View>
    )


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: woo_white
    },
    profileInfo: {
        textAlign: 'center'
    },
    header: {
        // shadowColor: '#000',
        // shadowOffset: { width: 1, height: 3 },
        // shadowOpacity: 0.2,
        // elevation: 4,
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
        marginTop: 10,
        padding: 0,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    tabHeader: {
        // flex: 1,
        // backgroundColor: 'red',
        marginTop: 10,
        padding: 5,
        alignItems: 'center',
    },
    tabText: {
        // flex: 1,
        fontSize: 18,
        color: woo_black,
        fontWeight: 'bold'
    }
})

export default ProfileScreen