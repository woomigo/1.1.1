import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {auth,db} from '../firebaseConfig';


const HomeScreen = () => {
    const [uid, setUID] = useState(null);

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
            <TouchableOpacity onPress={()=>logout()}><Text>Home Screen</Text></TouchableOpacity>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default HomeScreen;