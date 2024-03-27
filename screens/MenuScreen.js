import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Header, Icon } from "@rneui/themed";
import { signOut } from "firebase/auth";
import { auth } from '../firebaseConfig';

const MenuScreen = ({ navigation }) => {

    const logout = () => {
        signOut(auth).then(() => {
            console.log(`SIGNED OUT SUCCESSFULLY`)
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
            console.log(`ERROR: ${error}`)
        });
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
                        color="#f37320"
                        size={25}
                        onPress={() =>
                            navigation.navigate('Home')
                        }
                    />}
                centerComponent={
                    <View >
                        <Text style={{ fontSize: 25, color: "#f37320", textAlign: 'center', fontWeight: 'bold' }}>menu</Text>
                    </View>
                }
                // rightComponent={

                // }
                rightContainerStyle={styles.rightComponent}
                leftContainerStyle={styles.leftComponent}
                centerContainerStyle={styles.centerComponent}
            />

            <TouchableOpacity onPress={() => logout()}><Text>logout</Text></TouchableOpacity>
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
})

export default MenuScreen