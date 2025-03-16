import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { Header, Icon } from "@rneui/themed";
import { doc, getDoc, collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from '../firebaseConfig';
import ListViewPreviewMessages from './ListViewPreviewMessages';
import { woo_black } from '../assets/colors';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';


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
        <SafeAreaView style={styles.container}>
            {/* <Header
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
            /> */}

                  <View style={styles.header}>
                    <View
                      style={{
                        // backgroundColor: "blue",
                        flex: 3,
                        alignItems: "flex-start",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 22,
                          color: woo_black,
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        messages
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        // backgroundColor: "red",
                        flexDirection: "row",
                        justifyContent: "space-around",
                      }}
                    >
                      <FontAwesome6Icon
                        name="pen-to-square"
                        size={26}
                        color={woo_black}
                      />
                      <FontAwesome6Icon
                        name="ellipsis"
                        size={26}
                        color={woo_black}
                      />
                    </View>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        flex: 1,
                        height: 1,
                        backgroundColor: "#b3b3b3",
                        marginHorizontal: 10,
                        marginVertical: 10,
                      }}
                    />
                  </View>

            <ListViewPreviewMessages uid={uid} messagers={messagers} />

        </SafeAreaView>
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
        height: 50,
        alignItems: "flex-end",
        flexDirection: "row",
        paddingHorizontal: 20,
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