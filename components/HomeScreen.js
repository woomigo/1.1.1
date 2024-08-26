import React, { useState, useEffect } from "react"; "@rneui/themed"
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from "react-native";
import { Header, Icon, Badge, Avatar, ButtonGroup } from "@rneui/themed";
import { auth, db } from '../firebaseConfig';
import ListViewGallery from './ListViewGallery';
import ListViewWoos from "./ListViewWoos";
import { Gallery, UserWoos } from './shared';
import { woo_black, woo_gray, woo_orange, woo_white } from "../assets/colors";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";


const HomeScreen = ({ navigation, route }) => {

    const { uid } = route.params;

    const [woos, setWoos] = useState([])

    const auth = getAuth();

    const logout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
    }




    useEffect(() => {
        console.log("Anything " + uid)
        const q = query(collection(db, "woos"), where("woo_migos", "array-contains", uid));
        const getWoos = onSnapshot(q, (querySnapshot) => {
            const homeWoos = [];
            querySnapshot.forEach((doc) => {
                console.log("HERE: " + JSON.stringify(doc))
                homeWoos.push(doc);
            });
            setWoos(homeWoos)
        }, (error) => {

        });
        return () => {
            getWoos()
        }
    }, [uid])

    return (
        <View style={styles.container}>
            {/* <SafeAreaView> */}
            <Header
                containerStyle={styles.header}
                backgroundColor={woo_white}
                leftComponent={

                    <Icon
                        type='font-awesome-5'
                        color={woo_black}
                        solid
                        size={25}
                    />

                }
                centerComponent={
                    <View >
                        <Text style={{ fontSize: 25, color: woo_black, textAlign: 'center', fontWeight: 'bold' }}>woomigo</Text>
                    </View>
                }
                rightComponent={
                    <Icon
                        name={'sign-out-alt'}
                        type='font-awesome-5'
                        color={woo_black}
                        solid
                        size={25}
                        onPress={() => logout()
                        }
                    />

                }
                rightContainerStyle={styles.rightComponent}
                leftContainerStyle={styles.leftComponent}
                centerContainerStyle={styles.centerComponent}
            />

            <ListViewWoos view={'list'} woos={woos} uid={uid} />
            {/* </SafeAreaView> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: woo_white,
        marginBottom: 100
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
        marginVertical: 10,
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
})

export default HomeScreen;