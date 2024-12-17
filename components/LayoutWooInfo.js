import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableWithoutFeedback, TouchableOpacity, Linking } from 'react-native';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from '../firebaseConfig';
import { Icon, Avatar, Card } from "@rneui/themed";
import { woo_gray, woo_black } from '../assets/colors';
import { useNavigation } from '@react-navigation/native';

const LayoutWooInfo = ({ wooType, ownerUID, sharedProfilePic }) => {

    const navigation = useNavigation();

    const [user, setUser] = useState()
    const [username, setUsername] = useState()
    const [profilePicURL, setProfilePicURL] = useState()


    useEffect(() => {
        console.log()
        const docRef = doc(db, "users", ownerUID);
        const getProfileInfo = onSnapshot(docRef, (doc) => {
            // console.log("Document data:", doc.data());
            setUser(doc.data())
            setUsername(doc.data().username)
            setProfilePicURL(doc.data().profile_pic_url)
        }, (error) => {

        })

        return () => {
            getProfileInfo()
        };
    }, [])

    const openCal = () => {
        if (Platform.OS === 'ios') {
            Linking.openURL('calshow:');
        } else if (Platform.OS === 'android') {
            Linking.openURL('content://com.android.calendar/time/');
        }
    }

    return (

        <Card containerStyle={styles.container} wrapperStyle={styles.wrapper}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                <TouchableWithoutFeedback style={styles.wooOwnerImageContainer}>
                    <Avatar
                        rounded
                        size="medium"
                        source={{ uri: profilePicURL }}
                    />
                </TouchableWithoutFeedback>
                <View style={{ justifyContent: 'flex-end' }}>
                    <TouchableWithoutFeedback onPress={() => navigation.navigate('User', { user: user })}>
                        <Text style={styles.wooOwnerUsernameText}>@{username}</Text>
                    </TouchableWithoutFeedback>
                </View>

            </View>


            <View style={styles.textContainer}>
                <View style={styles.timeDateContainer}>
                    {wooType !== undefined ?
                        < Icon
                            name={wooType === "private" ? "lock" : null}
                            type='font-awesome-5'
                            color={woo_gray}
                            size={20}
                            style={{ margin: 5 }}
                        /> : null}
                    <TouchableOpacity style={styles.wooMenuContainer}>
                        <Icon
                            name="ellipsis-v"
                            type='font-awesome'
                            color={woo_black}
                            style={{ margin: 5 }}
                        />
                    </TouchableOpacity>
                </View>

            </View>
        </Card>

    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 5,
        margin: 0,
        paddingHorizontal: 5,
        paddingVertical: 3,
        // backgroundColor: 'blue'
    },
    wrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor: 'yellow'
    },

    wooOwnerUsernameText: {
        fontWeight: 'bold',
    },

    textContainer: {
        marginStart: 5,
        justifyContent: 'center',
        // backgroundColor: 'green'
    },
    timeDateContainer: {
        flexDirection: 'row'
    },
})

export default LayoutWooInfo;