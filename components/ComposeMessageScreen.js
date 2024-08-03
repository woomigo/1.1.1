import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Text, TextInput, SafeAreaView, Image, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { Header, Icon, SearchBar, Avatar, Input } from "@rneui/themed";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LayoutComposeMessageItem from "./LayoutComposeMessageItem";
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, setDoc, addDoc, arrayUnion, doc, arrayRemove, serverTimestamp } from "firebase/firestore";
import { ComposeMessage } from "./shared";
import LayoutInputText from "./LayoutInputText";
import { woo_black, woo_orange, woo_white } from "../assets/colors";



const ComposeMessageScreen = ({ route, navigation }) => {

    const { receiversUID, uid } = route.params;

    const keyboardVerticalOffset = Platform.OS === 'ios' ? 190 : 0

    const insets = useSafeAreaInsets();
    const [user, setUser] = useState("")
    const [message, setMessage] = useState('');
    const [searchValue, setSearchValue] = useState([])
    const [isSearchError, setIsSearchError] = useState()
    const [isSearchIconHidden, setSearchIconHidden] = useState(true)
    const [isMessageError, setIsMessageError] = useState()
    const [isMessageIconHidden, setMessageIconHidden] = useState(true)
    const [view, setView] = useState("migoSuccess")

    const searchRef = useRef()
    const messageRef = useRef()


    useEffect(() => {


    }, [receiversUID])

    const handleSearch = async () => {
        setView('none')
        console.log("SEARCH")
        const q = query(collection(db, "users"), where("username", "==", searchValue));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            setView()
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data().followers);
            setUser(doc.data())

        }, (error) => {
            console.log(error)
        });
        searchRef.current.clear()
        searchRef.current.blur()
    }

    const createRefToOwner = async () => {
        try {
            const updateTimestamp = await setDoc(doc(db, "users", uid, "messages", user.uid), {
                timestamp: serverTimestamp()
            });
            // console.log("timestamp ", updateTimestamp)
            try {
                const addMessageRef = await addDoc(collection(db, "users", uid, "messages", user.uid, "messages"), {
                    
                })
                console.log("OWNER REF SAVED TO DB ", addMessageRef.id)
            }
            catch (error) {
                console.log(error)
            }

        }
        catch (error) {
            console.log(error)
        }

    }

    const createRefToUser = async () => {
        try {
            const updateTimestamp = await setDoc(doc(db, "users", user.uid, "messages", uid), {
                timestamp: serverTimestamp()
            });
            // console.log("user " + updateTimestamp.timestamp)
            try {
                const addMessageRef = await addDoc(collection(db, "users", user.uid, "messages", uid, "messages"), {})
                console.log("USER REF SAVED TO DB ", addMessageRef.id)
                handleNavigateToMessages()
            }
            catch (error) {
                console.log(error)
            }
        }
        catch (error) {
            console.log(error)
        }

    }

    const handleNavigateToMessages = () => {
        navigation.navigate('Messages', { user: user, messageParam: message })
    }

    const handleUserClicked = () => {
        createRefToOwner()
        createRefToUser()
    }

    const handleSearchOnChange = (input) => {
        if (input.length > 0) {
            setSearchIconHidden(false)
        } else {
            setSearchIconHidden(true)
        }
        setIsSearchError(false)
        setSearchValue(input)
    }

    const handleSearchOnFocus = () => {
        setSearchValue()
        setUser()
        setView()
        console.log('FOCUS')
    }

    const handleSearchEndEditing = () => {
        setSearchIconHidden(true)
    }

    const handleMessage = () => {
        setIsMessageError(true)
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

    const renderMessages = (message) => {
        <LayoutComposeMessageItem uid={message.item.uid} messageUID={message.item.uid} message={message.item.message} profilePic={message.item.profilePic} username={message.item.username} time={message.item.time} messageId={message.item.id} />
    }


    return (
        <SafeAreaView style={{ flex: 1, marginTop: -insets.top }}>
            <Header
                style={styles.header}
                backgroundColor={woo_white}
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
                        <Text style={{ fontSize: 25, color: { woo_black }, textAlign: 'center', fontWeight: 'bold' }}>new message</Text>
                    </View>
                }
                // rightComponent={
                //     <Icon
                //         name="user-plus"
                //         type='font-awesome-5'
                //         color={woo_black}
                //         size={25}
                //         onPress={() =>
                //             navigation.navigate('MigoRequests')
                //         }
                //     />
                // }
                rightContainerStyle={styles.rightComponent}
                leftContainerStyle={styles.leftComponent}
                centerContainerStyle={styles.centerComponent}
            />

            <KeyboardAvoidingView backgroundColor={woo_white} behavior='position'>
                <Input
                    value={searchValue}
                    ref={searchRef}
                    onChangeText={text => handleSearchOnChange(text)}
                    placeholder='search users by @username'
                    fontSize={14}
                    leftIcon={<Icon style={{ paddingEnd: 5 }} type='font-awesome-5' name='search' size={18} />}
                    // errorStyle={{ color: 'red' }}
                    // errorMessage={isSearchError && "sorry we couldn't find that Search"}
                    autoCapitalize="none"
                    onFocus={() => handleSearchOnFocus()}
                    onEndEditing={() => handleSearchEndEditing()}
                    rightIcon={!isSearchIconHidden && <Icon name="play" type='font-awesome-5' size={18} onPress={() => handleSearch()} />}
                />
            </KeyboardAvoidingView>

            <View style={styles.textInputContainer}>
                {user && user ?
                    user.uid === uid ?
                        // searching for self
                        <View style={styles.userInfoContainer}>
                            <View style={styles.imageContainer}>
                                <Avatar
                                    rounded
                                    size="medium"
                                    source={{ uri: `${user.profile_pic_url}` }}
                                />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{SelfIdentity[Math.floor(Math.random() * SelfIdentity.length)].header}</Text>
                                <Text style={{ fontSize: 12 }}>{SelfIdentity[Math.floor(Math.random() * SelfIdentity.length)].message}</Text>
                            </View>
                            {/* <View style={styles.requestButtonContainer}>
                            <TouchableOpacity
                                style={[styles.addButton, { backgroundColor: woo_gray }]}
                                onPress={() => handleFollowUser()}
                            ><Text style={styles.buttonText}>follow</Text>
                            </TouchableOpacity>
                        </View> */}
                        </View>
                        :
                        // searching for user with no error
                        <View style={styles.container}>

                            <TouchableOpacity style={styles.userInfoContainer} onPress={() => handleUserClicked()}>
                                <View style={styles.imageContainer}>
                                    <Avatar
                                        rounded
                                        size="medium"
                                        source={{ uri: `${user.profile_pic_url}` }}
                                    />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{user.first_name + " " + user.last_name}</Text>
                                    <Text style={{ fontSize: 12 }}>@{user.username}</Text>
                                </View>
                                <View style={styles.requestButtonContainer}>
                                    {/* {renderView(view)} */}
                                </View>
                            </TouchableOpacity>

                        </View>
                    :
                    view === 'none' ?
                        <View style={{ alignItems: 'center' }}><Text> no user found </Text></View> : null
                }

                <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={keyboardVerticalOffset}>
                    <Input
                        value={message}
                        ref={messageRef}
                        style={{ paddingStart: 5 }}
                        errorStyle={{ color: 'red' }}
                        errorMessage={isMessageError && "please add a user"}
                        onChangeText={message => handleMessageOnChange(message)}
                        placeholder='message'
                        fontSize={14}
                        backgroundColor={woo_white}
                        autoCapitalize="none"
                        // onFocus={() => handleSearchOnFocus()}
                        onEndEditing={() => handleMessageEndEditing()}
                        rightIcon={!isMessageIconHidden && <Icon name="play" type='font-awesome-5' size={18} onPress={() => handleMessage()} />}
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
    userInfoContainer: {
        flex: 1,
        backgroundColor: woo_white,
        alignItems: 'center',
        flexDirection: 'row',
        padding: 20,
    },
    imageContainer: {
        flex: .4,
        // backgroundColor: 'red'
    },
    textContainer: {
        flex: 1,
        // backgroundColor: 'blue'
    },
    header: {
        shadowColor: woo_black,
        shadowOffset: { width: 1, height: 3 },
        shadowOpacity: 0.2,
        elevation: 4,
    },
    searchBarContainer: {
        backgroundColor: woo_white,
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent'
    },
    searchBarInputContaner: {
        backgroundColor: woo_orange
    },
    searchBarInput: {
        backgroundColor: woo_white,
        color: woo_black,
        paddingStart: 5
    },
    searchBarIcon: {
        color: woo_white
    },
    searchBarClearIcon: {
        color: woo_white,
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
        color: woo_white,
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