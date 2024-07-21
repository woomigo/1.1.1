import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from "react-native";
import { Header, Icon } from "@rneui/themed";
import { doc, getDoc, collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from '../firebaseConfig';
import ListViewPreviewMessages from './ListViewPreviewMessages';
import { woo_black } from '../assets/colors';


const MessagesPreviewScreen = ({ navigation, route }) => {

    const { uid } = route.params;

    const [messagers, setMessagers] = useState()

    useEffect(() => {
        // const messagesRef = collection(db, "users", uid, "messages");
        // const getProfileInfo = onSnapshot(messagesRef, (doc) => {
        //     // console.log("Document data:", doc.data());
        //     setMessages(doc.data())
        // }, (error) => {

        // })

        const q = query(collection(db, "users", uid, "messages"), orderBy("timestamp", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const arrayOfMessangers = [];
            querySnapshot.forEach((doc) => {
                // console.log(doc.id)
                arrayOfMessangers.push(doc.id);
            });
            // console.log("Messages Owned by this USER: ", arrayOfMessangers.join(", "));
            setMessagers(arrayOfMessangers)
        }, (error) => {

        });
        return () => {
            unsubscribe()
            // getProfileInfo()
        };
    }, [])

    return (
        <View style={styles.container}>
            <Header
                containerStyle={styles.header}
                backgroundColor={'#fff'}
                // leftComponent={

                //    }
                centerComponent={
                    <View >
                        <Text style={{ fontSize: 25, color: woo_black, textAlign: 'center', fontWeight: 'bold' }}>messages</Text>
                    </View>
                }
                rightComponent={

                    <Icon
                        name="comment-medical"
                        type='font-awesome-5'
                        color={woo_black}
                        size={20}
                        onPress={() =>
                            navigation.navigate('ComposeMessage', { isComposing: true })
                        }

                    />

                }
                rightContainerStyle={styles.rightComponent}
                leftContainerStyle={styles.leftComponent}
                centerContainerStyle={styles.centerComponent}
            />

            <ListViewPreviewMessages uid={uid} messagers={messagers} />

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
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 4,
        marginBottom: 5,
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

export default MessagesPreviewScreen