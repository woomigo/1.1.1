import React, { useEffect, useState } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback, View, StyleSheet, Text, Image, FlatList, Alert, Pressable } from 'react-native';
import { Icon, Card } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { woo_black, woo_gray, woo_orange } from '../assets/colors';
import { collection, query, where, getDocs, updateDoc, arrayUnion, doc, arrayRemove, onSnapshot } from "firebase/firestore";
import { db } from '../firebaseConfig';
// import LayoutMigosItem from './LayoutMigosItem';


const WooMigoImage = ({ userID }) => {
    const [profilePicURL, setProfilePicURL] = useState()

    useEffect(() => {
        const docRef = doc(db, "users", userID);
        const getProfileInfo = onSnapshot(docRef, (doc) => {
            // console.log("Document data:", doc.data());
            setProfilePicURL(doc.data().profile_pic_url)
        }, (error) => {

        })

        return () => {
            getProfileInfo()
        };
    }, [])

    return (
        <Image
            style={styles.wooMigoImage}
            source={{ uri: profilePicURL }}
        />
    )
}

const LayoutWooLike = ({ wooLikes, wooMigos, wooType, uid, wooID }) => {
    const navigation = useNavigation();

    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        wooLikes.includes(uid) && setIsLiked(true)
    })

    const addUIDToWooLikes = async () => {
        await updateDoc(doc(db, "woos", wooID), {
            woo_likes: arrayUnion(uid)
        })
        console.log("ADD")
    }

    const removeUIDFromWooLikes = async () => {
        await updateDoc(doc(db, "woos", wooID), {
            woo_likes: arrayRemove(uid)
        })
        console.log("REMOVE")
    }

    const toggleIsLiked = () => {
        isLiked ? removeUIDFromWooLikes() : addUIDToWooLikes()
        setIsLiked(!isLiked)
    }

    const confirmAddToWoo = () =>
        Alert.alert(
            "Add Woo",
            "Are you sure you would like to add this woo to your woos?",
            [
                {
                    text: "Add",
                    onPress: () => navigation.navigate('Woos'),
                    style: "default"
                },
                {
                    text: "Cancel",
                    style: "destructive",
                    onPress: () => {
                        console.log("Clear Pressed")
                        clearNotfications
                    }
                }
            ]
        );


    return (
        <Card containerStyle={styles.container}>
            <View style={styles.likesWooMigosContainer}>
                <View style={styles.likesContainer}>
                    <Pressable style={{ marginEnd: 20, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }} onPressOut={toggleIsLiked}>
                        <Icon
                            name="heart"
                            type='font-awesome-5'
                            color={woo_orange}
                            solid={isLiked}
                            size={25}
                            onPress={toggleIsLiked}
                        />
                    </Pressable >
                    <Text style={{}}>{wooLikes.length}</Text>
                    {/* {wooType !== 'private' ?
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('Share')
                            }>
                            <Icon
                                name="share"
                                type='font-awesome-5'
                                color={woo_gray}
                            />
                        </TouchableOpacity>
                        : <TouchableOpacity></TouchableOpacity>
                    } */}

                    {wooType === 'public' ? <TouchableOpacity style={{ marginStart: 50 }} onPress={confirmAddToWoo}>
                        <Icon
                            name="plus-square"
                            type='font-awesome-5'
                            color={woo_gray}
                        />
                    </TouchableOpacity> : <TouchableOpacity></TouchableOpacity>}

                </View>
                {wooMigos &&
                    <View style={styles.wooMigosContainer}>
                        <View>
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate('WooMigosView', { migos: wooMigos })
                                }>
                                <Text style={styles.wooMigoCountText}>{Object.keys(wooMigos).filter((key) => key >= 0).length}</Text>
                            </TouchableOpacity>

                        </View>

                        <View style={styles.wooMigosImagesContainer}>
                            {
                                wooMigos.length > 0 &&
                                <WooMigoImage userID={wooMigos[0]} />
                            }
                            {
                                wooMigos.length > 1 &&
                                <WooMigoImage userID={wooMigos[1]} />
                            }
                            {
                                wooMigos.length > 2 &&
                                <WooMigoImage userID={wooMigos[2]} />
                            }
                            {
                                wooMigos.length > 3 &&
                                <WooMigoImage userID={wooMigos[3]} />
                            }
                        </View>
                    </View>
                }

            </View>

        </Card>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 5,
        margin: 0,
        padding: 10
        // flex: .7,
        // paddingTop: 5,
        // paddingBottom: 5,
        // marginTop: 5,
        // justifyContent: 'center',
        // alignItems: 'center',
        // backgroundColor: 'red'

    },
    likesWooMigosContainer: {
        justifyContent: 'space-between',
        // backgroundColor: 'red',
        flexDirection: 'row',
    },
    likesContainer: {
        flex: 1,
        marginHorizontal: 15,
        alignItems: 'center',
        // justifyContent: 'space-around',
        // backgroundColor: 'yellow',
        flexDirection: 'row',

    },
    wooMigosContainer: {
        flex: 1,
        // backgroundColor: 'green',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginEnd: 5,

    },
    wooMigoCountText: {
        textDecorationLine: "underline"
    },
    wooMigosImagesContainer: {
        flexDirection: 'row',
    },
    wooMigoImage: {
        width: 30,
        height: 30,
        borderRadius: 25,
        marginEnd: 5
    },
})

export default LayoutWooLike;