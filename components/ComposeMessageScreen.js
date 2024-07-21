import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Text, TextInput, SafeAreaView, Image, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { Header, Icon, SearchBar, Avatar, Input } from "@rneui/themed";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LayoutComposeMessageItem from "./LayoutComposeMessageItem";
import { doc, getDoc, collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from '../firebaseConfig';
import { ComposeMessage } from "./shared";
import LayoutInputText from "./LayoutInputText";
import { woo_black, woo_white } from "../assets/colors";



const ComposeMessageScreen = ({ route, navigation }) => {

    const { user, uid } = route.params;

    useEffect(() => {
        // const docRef = doc(db, "users", uid);
        // const getProfileInfo = onSnapshot(docRef, (doc) => {
        //     // console.log("Document data:", doc.data());
        //     setOwner(doc.data())
        //     // setGallery(doc.data().gallery)
        //     // setUsername(doc.data().username)
        //     // setFirstName(doc.data().first_name)
        //     // setLastName(doc.data().last_name)
        //     // setProfilePicURL(doc.data().profile_pic_url)
        //     // setFollowing(doc.data().following)
        //     // setFollowers(doc.data().followers)
        //     // setMigos(doc.data().migos)
        // }, (error) => {

        // })

        const q = query(collection(db, "users", uid, "messages", user.uid, "messages"), orderBy("created_at", "asc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const arrayofMessages = [];
            querySnapshot.forEach((doc) => {
                console.log(doc.data())
                arrayofMessages.push(doc.data());
            });
            // console.log("Messages Owned by this USER: ", arrayofMessages.join(", "));
            setMessages(arrayofMessages)
            // let dateTime = new Date(arrayofMessages[0].created_at * 1000)
            // let hours = dateTime.getHours()
            // let minutes = dateTime.getMinutes()
            // setTime(dateTime.toLocaleTimeString());

        }, (error) => {

        });

        return () => {
            // getProfileInfo()
            unsubscribe()
        };
    }, [])

    const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 0

    const insets = useSafeAreaInsets();
    const [messages, setMessages] = useState()
    const [message, setMessage] = useState('');
    const [owner, setOwner] = useState()
    const [isMessageIconHidden, setMessageIconHidden] = useState(true)
    const [isMessageError, setIsMessageError] = useState()

    const messageRef = useRef()

    const handleMessage = () => {
        messageRef.current.clear()
        messageRef.current.blur()
    }

    const handleMessageOnChange = (input) => {
        if (input.length > 0) {
            setMessageIconHidden(false)
        } else {
            setMessageIconHidden(true)
        }
        setIsMessageError(false)
        setMessage(input)
    }

    const handleMessageEndEditing = () => {
        setMessageIconHidden(true)
    }



    // const renderMessages = (message) => {
    //     <LayoutComposeMessageItem uid={message.item.uid} messageUID={message.item.uid} message={message.item.message} profilePic={message.item.profilePic} username={message.item.username} time={message.item.time} messageId={message.item.id} />
    // }


    return (
        <SafeAreaView style={{ flex: 1, marginTop: -insets.top }}>
            <Header
                style={styles.header}
                backgroundColor={'#fff'}
                leftComponent={
                    <Icon
                        name="chevron-left"
                        type='font-awesome-5'
                        color={woo_black}
                        size={25}
                        onPress={() =>
                            navigation.navigate('MessagesPreview')
                        }
                    />}
                centerComponent={
                    <View >
                        <Avatar
                            rounded
                            size="medium"
                            onPress={() =>
                                navigation.navigate('User')
                            }
                            source={{ uri: user.profile_pic_url }}
                        />
                    </View>
                }
                rightContainerStyle={styles.rightComponent}
                leftContainerStyle={styles.leftComponent}
                centerContainerStyle={styles.centerComponent}
            />

            <View style={styles.textInputContainer}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    keyExtractor={message => message.id}
                    data={messages}
                    backgroundColor={"#fff"}
                    // initialNumToRender={3}
                    renderItem={(message) => <LayoutComposeMessageItem uid={uid} receiversUID={message.item.receiver_uid} sendersUID={message.item.senders_uid} message={message.item.message} time={message.item.created_at} messageId={message.item.id} />} />

                <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={keyboardVerticalOffset}>
                    <Input
                        value={message}
                        ref={messageRef}
                        onChangeText={message => handleMessageOnChange(message)}
                        placeholder='message'
                        fontSize={14}
                        backgroundColor={woo_white}
                        // leftIcon={<Avatar
                        //     rounded
                        //     size="small"
                        //     source={{ uri: "https://images.unsplash.com/photo-1596215143922-eedeaba0d91c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80" }}
                        // />}
                        // errorStyle={{ color: 'red' }}
                        // errorMessage={isSearchError && "sorry we couldn't find that Search"}
                        autoCapitalize="none"
                        // onFocus={() => handleSearchOnFocus()}
                        onEndEditing={() => handleMessageEndEditing()}
                        rightIcon={!isMessageIconHidden && <TouchableOpacity style={{ width: 18, height: 18 }}><Icon name="play" type='font-awesome-5' size={18} onPress={() => handleMessage()} /></TouchableOpacity>}
                    />
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: woo_white
    },
    header: {
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 3 },
        shadowOpacity: 0.2,
        elevation: 4,
    },
    searchBarContainer: {
        backgroundColor: "#fff",
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent'
    },
    searchBarInputContaner: {
        backgroundColor: '#f37320'
    },
    searchBarInput: {
        backgroundColor: '#fff',
        color: "#000",
        paddingStart: 5
    },
    searchBarIcon: {
        color: '#fff'
    },
    searchBarClearIcon: {
        color: '#fff',
    },
    centerComponent: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    sectionStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#555',
        borderWidth: 1,
        borderColor: '#555',
        height: 40,
        borderRadius: 10,
        margin: 5,
        color: '#fff',
    },
    ImageStyle: {
        padding: 10,
        margin: 5,
        marginEnd: 10,
        height: 25,
        width: 25,
        alignItems: 'center',
        borderRadius: 25,
    },
    textInputContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: woo_white
    },
    leftComponent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default ComposeMessageScreen;