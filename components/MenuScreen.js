// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import { Header, Icon } from "@rneui/themed";
// import { signOut } from "firebase/auth";
// import { auth } from '../firebaseConfig';

// const MenuScreen = ({ navigation }) => {

//     const logout = () => {
//         signOut(auth).then(() => {
//             console.log(`SIGNED OUT SUCCESSFULLY`)
//             // Sign-out successful.
//         }).catch((error) => {
//             // An error happened.
//             console.log(`ERROR: ${error}`)
//         });
//     }

//     return (
//         <View style={styles.container}>
//             <Header
//                 style={styles.header}
//                 backgroundColor={'#fff'}
//                 leftComponent={
//                     <Icon
//                         name="chevron-left"
//                         type='font-awesome-5'
//                         color="#f37320"
//                         size={25}
//                         onPress={() =>
//                             navigation.navigate('Home')
//                         }
//                     />}
//                 centerComponent={
//                     <View >
//                         <Text style={{ fontSize: 25, color: "#f37320", textAlign: 'center', fontWeight: 'bold' }}>menu</Text>
//                     </View>
//                 }
//                 // rightComponent={

//                 // }
//                 rightContainerStyle={styles.rightComponent}
//                 leftContainerStyle={styles.leftComponent}
//                 centerContainerStyle={styles.centerComponent}
//             />

//             <TouchableOpacity onPress={() => logout()}><Text>logout</Text></TouchableOpacity>
//         </View>
//     )

// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#fff"
//     },
//     profileInfo: {
//         textAlign: 'center'
//     },
//     header: {
//         shadowColor: '#000',
//         shadowOffset: { width: 1, height: 3 },
//         shadowOpacity: 0.2,
//         elevation: 4,
//     },
//     leftComponent: {
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     centerComponent: {
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     rightComponent: {
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
// })

// export default MenuScreen

import React from 'react'
import { Text, StyleSheet, View, SafeAreaView, FlatList } from 'react-native'
import { Header, Icon, Avatar } from "@rneui/themed"
import { MenuItems } from './shared/';
import LayoutMenuItem from './LayoutMenuItem';
import { woo_black } from '../assets/colors';

const MenuScreen = ({ navigation }) => {

    const renderMenuItems = (menuItem) => (
        <LayoutMenuItem menuItem={menuItem} />
    )

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
                        <Text style={{ fontSize: 25, color: {woo_black}, textAlign: 'center', fontWeight: 'bold' }}>menu</Text>
                    </View>
                }
                // rightComponent={

                // }
                rightContainerStyle={styles.rightComponent}
                leftContainerStyle={styles.leftComponent}
                centerContainerStyle={styles.centerComponent}
            />

            <View style={styles.profilePicContainer}>
                <Avatar
                    rounded
                    size="large"
                    onPress={() =>
                        navigation.navigate('Profile')
                    }
                    source={{ uri: "https://images.unsplash.com/photo-1596215143922-eedeaba0d91c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80" }}
                />
                <Icon
                    name="star"
                    type="font-awesome-5"
                    color="#f37320"
                    size={30}
                    style={styles.starIcon}
                    solid
                />

                <Text style={styles.firstLastNameText}>jessica washington</Text>
                <Text style={styles.usernameText}>@jess2u</Text>
                <Text style={styles.numOfMigosText}>migos: 320</Text>
            </View>

            <View style={styles.headerBottomBorder} />

            <FlatList
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                backgroundColor={"#fff"}
                keyExtractor={woo => woo.id}
                data={MenuItems}
                renderItem={renderMenuItems}
                initialNumToRender={3}
                maxToRenderPerBatch={3}
            />
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
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
    menuTextContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    menuText: {
        fontSize: 22,
        color: "#f37320",
    },
    profilePicContainer: {
        // flex: 1,
        alignItems: 'center',
        margin: 20,
    },
    firstLastNameText: {
        fontWeight: 'bold',
        margin: 3,
        fontSize: 30
    },
    usernameText: {
        margin: 3,
        fontSize: 24
    },
    numOfMigosText: {
        margin: 3,
        fontSize: 24
    },
    headerBottomBorder: {
        backgroundColor: '#f37320',
        height: 2,
        width: '100%',
    },
    starIcon: {
        margin: 3,
    }
})

export default MenuScreen