import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Header, Icon, Avatar } from "@rneui/themed";
import { woo_black, woo_white } from "../assets/colors";
import ListViewGalleryWoo from "./ListViewGalleryWoo";
import { doc, getDoc, collection, query, where, onSnapshot, or } from "firebase/firestore";
import { db } from '../firebaseConfig';

const AddMediaWooGalleryView = ({ navigation, route }) => {

    const { wooMedia, uid } = route.params;
    
    const [woos, setWoos] = useState()

    useEffect(() => {
        console.log("UID " + uid)

        const q = query(collection(db, "woos"),
        or(where("woo_migos", "array-contains", uid),
        where("owner_uid", "==", uid)) 
        );
        const getOwnedWoos = onSnapshot(q, (querySnapshot) => {
            const ownedWoos = [];
            querySnapshot.forEach((doc) => {
                // console.log(doc.id)
                ownedWoos.push(doc.data());
            });
            // console.log("Woos Owned by this USER: ", ownedWoos.join(", "));
            setWoos(ownedWoos)
        }, (error) => {

        });

        return () => {
            getOwnedWoos()
        };
    }, [uid])

    return (
        <View style={styles.container}>
            <Header
                containerStyle={styles.header}
                backgroundColor={woo_white}
                leftComponent={
                    <Icon
                        name="chevron-left"
                        type='font-awesome-5'
                        color={woo_black}
                        size={25}
                        onPress={() =>
                            navigation.goBack()
                        }
                    />}
                centerComponent={
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 25, color: woo_black, textAlign: 'center', fontWeight: 'bold' }}>add to woo gallery</Text>
                    </View>
                }
                // rightComponent={

                // }
                rightContainerStyle={styles.rightComponent}
                leftContainerStyle={styles.leftComponent}
                centerContainerStyle={styles.centerComponent}
            />

            <Text style={{ fontSize: 15, color: woo_black, textAlign: 'center', fontWeight: 'bold', marginTop: 15 }}>choose a woo</Text>

            <ListViewGalleryWoo uid={uid} woos={woos} kind={'wooGallery'} gridNumOfColumns={2} wooMedia={wooMedia} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: woo_white
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

export default AddMediaWooGalleryView;