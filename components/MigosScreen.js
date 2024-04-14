import React, { useState } from 'react';
import { View, Text, StyleSheet } from "react-native";
import { Header, Icon, Tab, TabView } from "@rneui/themed";
import { Migos } from './shared';
import ListViewUsers from './ListViewUsers';
import { woo_black, woo_orange } from '../assets/colors';

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
            >
                <Tab.Item
                    title="follow"
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
            <TabView value={index} onChange={setIndex} animationType="spring">
                <TabView.Item style={{ width: '100%' }}>
                    <View style={styles.tabHeader}>
                        <Text style={styles.tabText}>follow</Text>
                        <ListViewUsers users={Migos} searchBoxPlaceholder="search migos" kind="checkbox" />
                    </View>
                </TabView.Item>
                <TabView.Item style={{ width: '100%' }}>
                    <View style={styles.tabHeader}>
                        <Text style={styles.tabText}>followers</Text>
                        <ListViewUsers users={Migos} searchBoxPlaceholder="search migos" kind="checkbox" />
                    </View>
                </TabView.Item>
                <TabView.Item style={{ width: '100%' }}>
                    <View style={styles.tabHeader}>
                        <Text style={styles.tabText}>migos</Text>
                        <ListViewUsers users={Migos} searchBoxPlaceholder="search migos" kind="checkbox" />
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

export default MigosScreen