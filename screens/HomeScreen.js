import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Header, Icon, Badge, Avatar, ButtonGroup } from "@rneui/themed";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from '../firebaseConfig';



const HomeScreen = ({navigation}) => {
    const [uid, setUID] = useState(null);
    const [notificationCount, setNotificationCount] = useState('1');
    const [selectedIndex, setSelectedIndex] = useState(0);

    const logout = () => {
        signOut(auth).then(() => {
            console.log(`SIGNED OUT SUCCESSFULLY`)
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
            console.log(`ERROR: ${error}`)
        });
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user
            const uid = user.uid;
            setUID(user.uid)
            console.log(`HOME OASC UID === ${uid}`)
            // ...
        } else {
            // User is signed out
            // ...
        }
    });

    return (
        <View style={styles.container}>
            {/* <TouchableOpacity onPress={()=>logout()}><Text>Home Screen</Text></TouchableOpacity>  */}
            <Header
                style={styles.header}
                backgroundColor={'#fff'}
                leftComponent={
                    <Icon
                        name="camera"
                        type='font-awesome-5'
                        color="#f37320"
                        size={25}
                        onPress={() =>
                            navigation.navigate('Camera')
                        }
                    />}
                centerComponent={
                    <View>
                        <Avatar
                            rounded
                            size="large"
                            onPress={() =>
                                navigation.navigate('Profile')
                            }
                            source={{ uri: "https://images.unsplash.com/photo-1596215143922-eedeaba0d91c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80" }}
                        />{notificationCount > 0 ?
                            <Badge
                                status="error"
                                value={notificationCount}
                                containerStyle={{ position: 'absolute', top: 0, right: 0 }}
                                onPress={() =>
                                    navigation.navigate('Notifications')
                                }
                            />
                            : null}
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

            <View style={styles.subHeader}>
                <Icon
                    name="user-friends"
                    type='font-awesome-5'
                    color="#f37320"
                    solid
                    size={25}
                    onPress={() =>
                        navigation.navigate('Migos')
                    }
                />
                <Icon
                    name="search"
                    type='font-awesome-5'
                    color="#f37320"
                    solid
                    size={25}
                    onPress={() =>
                        navigation.navigate('Search')
                    }
                />
                <Icon
                    name="envelope"
                    type='font-awesome-5'
                    color="#f37320"
                    solid
                    size={25}
                    onPress={() =>
                        navigation.navigate('Messages')
                    }
                />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
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
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
})

export default HomeScreen;