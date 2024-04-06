import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Header, Icon, Avatar, Tab, TabView, Button } from "@rneui/themed";


const ProfileScreen = ({ navigation }) => {

    const [index, setIndex] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isProfileOwnedByUser, setIsProfileOwnedByUser] = useState(true);

    return (
        <View style={styles.container}>
            <Header
                style={styles.header}
                backgroundColor={'#fff'}
                leftComponent={
                    <Avatar
                        rounded
                        size="large"
                        onPress={() =>
                            navigation.navigate('Profile')
                        }
                        source={{ uri: "https://images.unsplash.com/photo-1596215143922-eedeaba0d91c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80" }}
                    />
                }
                centerComponent={
                    <View >
                        <Text style={{ marginBottom: 3, textAlign: 'center', fontWeight: 'bold' }}>Deserae Harrison</Text>
                        <Text style={{ marginBottom: 3, textAlign: 'center' }}>@dezzie_wezzie</Text>
                        <Text style={{ marginBottom: 3, textAlign: 'center' }}>1,2345 migos</Text>
                    </View>
                }
                rightComponent={
                    <TouchableOpacity onPress={() =>
                        navigation.navigate('Menu')
                    } >

                        <Icon
                            name="bars"
                            type='font-awesome-5'
                            color="#f37320"
                            solid
                            size={25}
                            onPress={() =>
                                navigation.navigate('Menu')
                            }
                        />
                    </TouchableOpacity>
                }
                rightContainerStyle={styles.rightComponent}
                leftContainerStyle={styles.leftComponent}
                centerContainerStyle={styles.centerComponent}
            />

            {
                !isProfileOwnedByUser ?

                    <View style={styles.subHeader}>
                        <View>
                            <Button radius={"lg"} size="sm" color="gray" type="solid">
                                message
                                <Icon style={{ marginStart: 5 }} name="envelope" solid type='font-awesome-5' size={14} color="white" />
                            </Button>
                        </View>
                        <View>
                            {isFollowing ?
                                <Button radius={"lg"} size="sm" color="gray" type="solid">
                                    unfollow
                                    <Icon style={{ marginStart: 5 }} name="user-minus" type='font-awesome-5' size={14} color="white" />
                                </Button>
                                :
                                <Button radius={"lg"} size="sm" color="gray" type="solid">
                                    follow
                                    <Icon style={{ marginStart: 5 }} name="user-plus" type='font-awesome-5' size={14} color="white" />
                                </Button>}
                        </View>
                    </View> : null
            }

            {
                isProfileOwnedByUser ?
                    <View style={styles.subHeader}>
                        <View>
                            <Button radius={"lg"} size="sm" color="gray" type="solid">
                                edit profile
                                <Icon style={{ marginStart: 5 }} name="user-cog" solid type='font-awesome-5' size={14} color="white" />
                            </Button>
                        </View>
                    </View> : null
            }

            <Tab
                value={index}
                onChange={(e) => setIndex(e)}
                indicatorStyle={{
                    backgroundColor: '#f37320',
                    height: 3,
                }}
                containerStyle={{
                    marginTop: 20,
                    backgroundColor: "white"
                }}
            >
                <Tab.Item
                    title="published"
                    titleStyle={{ fontSize: 12, color: "#f37320" }}
                    icon={{ name: 'sign-out-alt', type: 'font-awesome-5', color: "#f37320" }}
                />
                <Tab.Item
                    title="subscribed"
                    titleStyle={{ fontSize: 12, color: "#f37320" }}
                    icon={{ name: 'sign-in-alt', type: 'font-awesome-5', color: "#f37320" }}
                />
                <Tab.Item
                    title="gallery"
                    titleStyle={{ fontSize: 12, color: "#f37320" }}
                    icon={{ name: 'photo-video', type: 'font-awesome-5', color: "#f37320" }}
                />
            </Tab>
            <TabView value={index} onChange={setIndex} animationType="spring">
                <TabView.Item style={{ width: '100%' }}>
                    <View style={styles.tabHeader}>
                        <Text style={styles.tabText}>Published Woos</Text>
                    </View>
                </TabView.Item>
                <TabView.Item style={{ width: '100%' }}>
                    <View style={styles.tabHeader}>
                        <Text style={styles.tabText}>Subscribed Woos</Text>
                    </View>
                </TabView.Item>
                <TabView.Item style={{ width: '100%' }}>
                    <View style={styles.tabHeader}>
                        <Text style={styles.tabText}>Gallery</Text>

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
    subHeader: {
        marginTop: 10,
        padding: 0,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    tabHeader: {
        marginTop: 10,
        padding: 5,
        alignItems: 'center'
    },
    tabText: {
        fontSize: 18,
        color: "#f37320",
        fontWeight: 'bold'
    }
})

export default ProfileScreen