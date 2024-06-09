import React, { useState } from 'react';
import { View, Text, StyleSheet } from "react-native";
import { Header, Icon, Tab, TabView } from "@rneui/themed";
import { Migos } from './shared';
import ListViewUsers from './ListViewUsers';
import { woo_black, woo_orange, woo_red } from '../assets/colors';

const MigoRequestScreen = ({ navigation }) => {

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
                        {/* <Text style={styles.tabText}>sent</Text> */}
                        <ListViewUsers users={Migos} kind="single" hideSearchBar singleBtnText='delete' singleBtnColor={woo_red}/>
                    </View>
                </TabView.Item>
                <TabView.Item style={{ width: '100%' }}>
                    <View style={styles.tabHeader}>
                        {/* <Text style={styles.tabText}>received</Text> */}
                        <ListViewUsers users={Migos} kind="double" hideSearchBar doubleBtn1Text='accept' doubleBtn2Text='ignore'/>
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