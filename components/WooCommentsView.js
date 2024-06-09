import React, { useState, useRef } from 'react'
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, Text, SafeAreaView, FlatList, KeyboardAvoidingView } from 'react-native'
import { Icon, Header, Input, Avatar } from '@rneui/themed'
import { Comments } from './shared'
// import LayoutCommentItem from './LayoutCommentItem'
// import LayoutInputTextComponent from './LayoutInputTextComponent'
// import LayoutWooCommentComponent from './LayoutWooCommentComponent'
import ListViewComments from './ListViewComments'
import { woo_black, woo_white, woo_orange } from '../assets/colors'

const WooCommentsView = ({ navigation: { navigate } }) => {

    const [comment, setComment] = useState()
    const [isCommentError, setIsCommentError] = useState()
    const [isCommentIconHidden, setCommentIconHidden] = useState(true)

    const commentRef = useRef()

    const addCommentInput = () => {
        setComment('')
        commentRef.current.clear()
        commentRef.current.blur()
    }

    const handleCommentOnChange = (input) => {
        if (input.length > 0) {
            setCommentIconHidden(false)
        } else {
            setCommentIconHidden(true)
        }
        setIsCommentError(false)
        setComment(input)
    }

    const handleCommentEndEditing = () => {
        setCommentIconHidden(true)
    }

    // const onSubmitHandler = () => {
    //     signInWithCommentAndPassword(auth, emailAddress, password)
    //         .then((userCredential) => {
    //             const user = userCredential.user;
    //         })
    //         .catch((error) => {
    //             const errorCode = error.code;
    //             const errorMessage = error.message;
    //             console.error(`ERROR CODE === ${errorCode} AND ERROR MESSAGE === ${errorMessage}`)
    //             if (errorCode == 'auth/user-not-found') {
    //                 setIsEmailError(true)
    //             }
    //             if (errorCode == 'auth/wrong-password') {
    //                 setIsPasswordError(true)
    //             }
    //             if (errorCode == 'auth/too-many-requests') {
    //                 setIsTooManyRequestsError(true)
    //             }
    //         });
    // }

    return (

        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

            <View style={styles.container}>
                <Header
                    containerStyle={styles.header}
                    backgroundColor={woo_white}
                    leftComponent={
                        <Icon
                            name="chevron-left"
                            type='font-awesome-5'
                            color={woo_black}
                            size={20}
                            onPress={() =>
                                navigate('Home')
                            }
                        />
                    }
                    centerComponent={
                        <View >
                          <Text style={{ fontSize: 25, color: woo_black, textAlign: 'center', fontWeight: 'bold' }}>woo comments</Text>
                        </View>
                      }
                      leftContainerStyle={styles.leftComponent}
                      centerContainerStyle={styles.centerComponent}
                />
                <ListViewComments comments={Comments} />
                <KeyboardAvoidingView behavior='position'>
                    <Input
                        value={comment}
                        ref={commentRef}
                        fontSize={14}
                        onChangeText={text => handleCommentOnChange(text)}
                        placeholder='comment'
                        leftIcon={<Avatar
                            rounded
                            size="small"
                            source={{ uri: "https://images.unsplash.com/photo-1596215143922-eedeaba0d91c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80" }}
                        />}
                        // errorStyle={{ color: 'red' }}
                        // errorMessage={isCommentError && "sorry we couldn't find that comment"}
                        autoCapitalize="none"
                        // onFocus={() => handleCommentOnFocus()}
                        onEndEditing={() => handleCommentEndEditing()}
                        rightIcon={!isCommentIconHidden && <Icon name="play" type='font-awesome-5' size={18} onPress={() => addCommentInput()} />}
                    />
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>


    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: woo_white
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
})

export default WooCommentsView