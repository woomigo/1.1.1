import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, TouchableWithoutFeedback } from 'react-native';
import { Avatar } from '@rneui/themed'
import { collection, query, where, getDocs, updateDoc, arrayUnion, doc, arrayRemove, onSnapshot } from "firebase/firestore";
import { db } from '../firebaseConfig';

const LayoutCommentItem = ({comment}) => {

    const [profilePicURL, setProfilePicURL] = useState()
    const [username, setUsername] = useState()
    const [timestamp, setTimestamp] = useState()

    useEffect(() => {
        // console.log(wooComments)
        const docRef = doc(db, "users", comment.item.comment_owner_uid);
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
        <View style={styles.container}>
            <View style={styles.commentHeaderContainer}>
                <View style={styles.commentHeaderUserContainer}>
                    <TouchableWithoutFeedback>

                    <Avatar
                            rounded
                            size="small"
                            source={{ uri: profilePicURL }}
                        />
                        {/* <Image
                            style={styles.commentUserImage}
                            source={{ uri: comment.item.profile }}
                        /> */}
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback>
                        <Text style={styles.commentUsername}>{username}</Text>
                    </TouchableWithoutFeedback>

                </View>

                <View style={styles.commentTimeContainer}>
                    <Text style={styles.commentTimeAgo}>{new Date(comment.item.timestamp * 1000).toLocaleTimeString()}</Text>
                </View>

            </View>
            <View style={styles.commentContainer}>
                <Text style={styles.comment}>{comment.item.comment}</Text>
            </View>
            {/* <View style={styles.likeReplyContainer}>
                <TouchableOpacity style={styles.likeContainer}>
                    <Icon
                        name="star"
                        type='font-awesome-5'
                        color='#b3b1b1'
                    ></Icon><Text style={styles.likeText}>{"like"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.replyContainer}>
                    <Icon
                        name="reply"
                        type='font-awesome-5'
                        color='#b3b1b1'
                    ></Icon><Text style={styles.replyText}>{"reply"}</Text>
                </TouchableOpacity>
            </View> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 2,
        paddingTop: 15,
        paddingBottom: 15,

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
        width: 20,
        height: 20,
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
        marginStart: 40,
        // fontSize: 12
    },
    likeReplyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginStart: 50,
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
        fontSize: 12
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
export default LayoutCommentItem;