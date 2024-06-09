import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Header, Icon, Avatar, Tab, TabView, Button } from "@rneui/themed";
import ListViewGallery from './ListViewGallery';
import ListViewGalleryWoo from './ListViewGalleryWoo';
import { Gallery } from './shared';
import { woo_black, woo_orange, woo_white } from '../assets/colors';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from '../firebaseConfig';
import { Drawer } from 'react-native-drawer-layout';
import MenuScreen from './MenuScreen';

const ProfileScreen = ({ navigation, route }) => {

    const [index, setIndex] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isProfileOwnedByUser, setIsProfileOwnedByUser] = useState(true);
    const [woos, setWoos] = useState([])
    const [open, setOpen] = useState(false);

    const { uid } = route.params;

    useEffect(() => {
        const q = query(collection(db, "woos"), where("owner_uid", "==", uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const ownedWoos = [];
            querySnapshot.forEach((doc) => {
                console.log(doc.id)
                ownedWoos.push(doc.data());
            });
            console.log("Woos Owned by this USER: ", ownedWoos.join(", "));
            setWoos(ownedWoos)
        });

        return () => unsubscribe();
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
                    return <MenuScreen />;
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
                                navigation.navigate('Migos') : "open drawer"
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
                                source={{ uri: "https://images.unsplash.com/photo-1596215143922-eedeaba0d91c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80" }}
                            />
                            <View>
                                {/* <Text style={{ color: woo_black, marginBottom: 3, textAlign: 'center',  }}>Deserae Harrison</Text> */}
                                <Text style={{ color: woo_black, marginBottom: 3, textAlign: 'center', fontWeight: 'bold' }}>@dezzie_wezzie</Text>
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
                        backgroundColor: "white"
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
                    <TabView.Item style={{ width: '100%' }}>
                        <View style={styles.tabHeader}>
                            <Text style={styles.tabText}>Woos</Text>
                            {woos &&
                                <ListViewGalleryWoo woos={woos} view={'grid'} gridNumOfColumns={2} />}
                        </View>
                    </TabView.Item>
                    <TabView.Item style={{ width: '100%' }}>
                        <View style={styles.tabHeader}>
                            <Text style={styles.tabText}>Gallery</Text>
                            <ListViewGallery gallery={Gallery} view={"grid"} />
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
        backgroundColor: "#fff"
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
        marginTop: 10,
        padding: 5,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 18,
        color: woo_black,
        fontWeight: 'bold'
    }
})

export default ProfileScreen