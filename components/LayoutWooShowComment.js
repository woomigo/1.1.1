import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Avatar, Card } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs, updateDoc, arrayUnion, doc, arrayRemove, onSnapshot } from "firebase/firestore";
import { db } from '../firebaseConfig';

const LayoutWooShowComment = ({ wooID, wooComments }) => {
    const navigation = useNavigation();
    const [profilePicURL, setProfilePicURL] = useState()
    const [username, setUsername] = useState()
    const [timestamp, setTimestamp] = useState()

    useEffect(() => {
        console.log(wooComments)
        setTimestamp(wooComments[0].timestamp)
        const docRef = doc(db, "users", wooComments[0].comment_owner_uid);
        const getProfileInfo = onSnapshot(docRef, (doc) => {
            // console.log("Document data:", doc.data());
            setProfilePicURL(doc.data().profile_pic_url)
            setUsername(doc.data().username)
        }, (error) => {

        })

        return () => {
            getProfileInfo()
        };
    }, [])
    
    return (
        <View>
            {
                wooComments.length > 0 ?
                    < Card containerStyle={styles.container} >
                        <View style={styles.commentHeaderContainer}>
                            <View style={styles.commentHeaderUserContainer}>
                                <TouchableWithoutFeedback>
                                    <Avatar
                                        rounded
                                        size="small"
                                        source={{ uri: profilePicURL }}
                                    />
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback>
                                    <Text style={styles.commentUsername}>{username}</Text>
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={styles.commentTimeContainer}>
                                <Text style={styles.commentTimeAgo}>{new Date(timestamp * 1000).toLocaleTimeString()}</Text>
                            </View>
                        </View>
                        <View style={styles.commentContainer}>
                            <Text style={styles.comment}>{wooComments[0].comment}</Text>
                        </View>
                        <View style={styles.seeMoreCommentsContainer}>
                            <TouchableOpacity onPress={() =>
                                navigation.navigate('WooCommentsView', { wooID: wooID })
                            } >
                                <Text style={styles.seeMoreCommentsText}>{`see ${wooComments.length - 1} more comments...`}</Text>
                            </TouchableOpacity>
                        </View>
                    </Card >
                    :
                    < Card containerStyle={styles.textContainer}>
                        <Text style={styles.text}>no woo comments</Text>
                    </Card >
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 5,
        margin: 0,
        padding: 10

    },
    textContainer: {
        width: '100%',
        borderRadius: 5,
        margin: 0,
        paddingHorizontal: 5,
        paddingVertical: 5,
        alignItems: 'center'
    },
    text: {
        margin: 10
    },
    commentHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginStart: 5,
        marginEnd: 5,
        // backgroundColor: 'blue'
    },
    commentHeaderUserContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginStart: 5,
    },
    commentUserImage: {
        width: 25,
        height: 25,
        borderRadius: 25,
        marginStart: 5,
    },
    commentUsername: {
        marginStart: 5,
        fontWeight: 'bold',
        // fontSize: 12
    },
    commentTimeContainer: {
        marginEnd: 5
    },
    commentTimeAgo: {
        justifyContent: 'flex-end',
        marginEnd: 5,
        fontSize: 10
    },
    comment: {
        marginTop: 5,
        marginStart: 50,
        // fontSize: 12
    },
    likeReplyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginStart: 40,
        marginTop: 3
    },
    likeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    replyContainer: {
        marginStart: 10,
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    seeMoreCommentsContainer: {
        marginStart: 50,
        marginTop: 10,

    },
    seeMoreCommentsText: {
        textDecorationLine: 'underline',
        // fontSize: 12
    },
    replyText: {
        marginStart: 3,
        fontSize: 10
    },
    likeText: {
        marginStart: 3,
        fontSize: 10
    }


})

export default LayoutWooShowComment;