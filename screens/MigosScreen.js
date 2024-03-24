import React, { useState } from 'react';
import { View, Text, StyleSheet } from "react-native";
import { Header, Icon, Tab, TabView } from "@rneui/themed";

const MigosScreen = ({ navigation }) => {

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
                        <Text style={{ fontSize: 25, color: "#f37320", textAlign: 'center', fontWeight: 'bold' }}>migos</Text>
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
                    title="follow"
                    titleStyle={{ fontSize: 12, color: "#f37320" }}
                    icon={{ name: 'user-friends', type: 'font-awesome-5', color: "#f37320" }}
                />
                <Tab.Item
                    title="followers"
                    titleStyle={{ fontSize: 12, color: "#f37320" }}
                    icon={{ name: 'users', type: 'font-awesome-5', color: "#f37320" }}
                />
                <Tab.Item
                    title="requests"
                    titleStyle={{ fontSize: 12, color: "#f37320" }}
                    icon={{ name: 'user-check', type: 'font-awesome-5', color: "#f37320" }}
                />
            </Tab>
            <TabView value={index} onChange={setIndex} animationType="spring">
                <TabView.Item style={{ width: '100%' }}>
                    <View style={styles.tabHeader}>
                        <Text style={styles.tabText}>follow</Text>
                    </View>
                </TabView.Item>
                <TabView.Item style={{ width: '100%' }}>
                    <View style={styles.tabHeader}>
                        <Text style={styles.tabText}>followers</Text>
                    </View>
                </TabView.Item>
                <TabView.Item style={{ width: '100%' }}>
                    <View style={styles.tabHeader}>
                        <Text style={styles.tabText}>requests</Text>
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

export default MigosScreen