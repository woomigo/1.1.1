import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Icon } from '@rneui/themed' ;
import { useNavigation } from '@react-navigation/native';

const LayoutWooShowComment = ({wooID}) => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <View style={styles.commentHeaderContainer}>
                <View style={styles.commentHeaderUserContainer}>
                    <TouchableWithoutFeedback>
                        <Image
                            style={styles.commentUserImage}
                            size={20}
                            source={{ uri: "https://images.unsplash.com/photo-1491349174775-aaafddd81942?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=634&q=80" }}
                        />
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback>
                        <Text style={styles.commentUsername}>{"BostonGirl"}</Text>
                    </TouchableWithoutFeedback>

                </View>

                <View style={styles.commentTimeContainer}>
                    <Text style={styles.commentTimeAgo}>{"4 mins ago"}</Text>
                </View>

            </View>
            <View style={styles.commentContainer}>
                <Text style={styles.comment}>{"I'll defintely be there!"}</Text>
            </View>
            {/* <View style={styles.likeReplyContainer}>
                <TouchableOpacity style={styles.likeContainer}>
                    <Icon
                        name="star"
                        type='font-awesome-5'
                        color='#b3b1b1'
                        size={12}
                    ></Icon><Text style={styles.likeText}>{"like"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.replyContainer}>
                    <Icon
                        name="reply"
                        type='font-awesome-5'
                        color='#b3b1b1'
                        size={12}
                    ></Icon><Text style={styles.replyText}>{"reply"}</Text>
                </TouchableOpacity>
            </View> */}
            <View style={styles.seeMoreCommentsContainer}>
                <TouchableOpacity  onPress={() =>
                navigation.navigate('WooCommentsView',{wooID: wooID})
            } >
                    <Text style={styles.seeMoreCommentsText}>{"see 323 more comments..."}</Text>
                </TouchableOpacity>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 2,
        paddingTop: 5,
        paddingBottom: 5,

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
        fontSize: 12
    },
    commentTimeContainer: {
        marginEnd: 5
    },
    commentTimeAgo: {
        justifyContent: 'flex-end',
        marginEnd: 5,
        fontSize: 8
    },
    comment: {
        marginTop: 5,
        marginStart: 50,
        fontSize: 12
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

export default LayoutWooShowComment;