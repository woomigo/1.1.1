import React, { useState } from 'react';
import { View, Text, StyleSheet } from "react-native";
import { Header, Icon, Avatar, Tab, TabView } from "@rneui/themed";

const ProfileScreen = ({ navigation }) => {

    const [index, setIndex] = useState(0);
    return (
        <View style={styles.container}>
            <Header
                style={styles.header}
                backgroundColor={'#fff'}
                leftComponent={
                    <Icon
                        name="chevron-left"
                        type='font-awesome-5'
                        color="#f37320"
                        size={25}
                        onPress={() =>
                            navigation.navigate('Home')
                        }
                    />}
                centerComponent={
                    <View >
                        <Text style={{ marginBottom: 3, textAlign: 'center', fontWeight: 'bold' }}>Deserae Harrison</Text>
                        <Text style={{ marginBottom: 3, textAlign: 'center' }}>@dezzie_wezzie</Text>
                        <Text style={{ marginBottom: 3, textAlign: 'center' }}>34 woos</Text>
                        <Text style={{ marginBottom: 3, textAlign: 'center' }}>1,2345 miogs</Text>
                    </View>
                }
                rightComponent={
                    <Avatar
                        rounded
                        size="medium"
                        onPress={() =>
                            navigation.navigate('Profile')
                        }
                        source={{ uri: "https://images.unsplash.com/photo-1596215143922-eedeaba0d91c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80" }}
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
                    backgroundColor: 'white',
                    height: 3,
                }}
                containerStyle={{
                    backgroundColor: "#f37320"
                }}
            >
                <Tab.Item
                    title="published"
                    titleStyle={{ fontSize: 12, color: 'white' }}
                    icon={{ name: 'sign-out-alt', type: 'font-awesome-5', color: 'white' }}
                />
                <Tab.Item
                    title="subscribed"
                    titleStyle={{ fontSize: 12, color: 'white' }}
                    icon={{ name: 'sign-in-alt', type: 'font-awesome-5', color: 'white' }}
                />
                <Tab.Item
                    title="gallery"
                    titleStyle={{ fontSize: 12, color: 'white' }}
                    icon={{ name: 'photo-video', type: 'font-awesome-5', color: 'white' }}
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