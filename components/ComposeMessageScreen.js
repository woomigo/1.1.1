import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Text, TextInput, SafeAreaView, Image, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { Header, Icon, SearchBar, Avatar, Input } from "@rneui/themed";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LayoutComposeMessageItem from "./LayoutComposeMessageItem";
import { ComposeMessage } from "./shared";
import LayoutInputText from "./LayoutInputText";
import { woo_black, woo_white } from "../assets/colors";



const ComposeMessageScreen = ({ route, navigation }) => {

    const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 0

    const insets = useSafeAreaInsets();
    const [message, setMessage] = useState('');
    const [uid, setUid] = useState(134)
    const [isComposing, setIsComposing] = useState(false);
    const [searchValue, setSearchValue] = useState([])
    const [isSearchError, setIsSearchError] = useState()
    const [isSearchIconHidden, setSearchIconHidden] = useState(true)
    const [isMessageError, setIsMessageError] = useState()
    const [isMessageIconHidden, setMessageIconHidden] = useState(true)

    const searchRef = useRef()
    const messageRef = useRef()

    const handleSearch = () => {

        searchRef.current.clear()
        searchRef.current.blur()
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

    const handleSearchEndEditing = () => {
        setSearchIconHidden(true)
    }

    const handleMessage = () => {

        MessageRef.current.clear()
        MessageRef.current.blur()
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

    const { receiversUID } = route.params;

    useEffect(() => {
        if (receiversUID != undefined) {
            if (receiversUID.length > 0) {
                setIsComposing(false)
            } else {
                setIsComposing(true)
            }
        }

    }, [receiversUID])

    const renderMessages = (message) => {
        <LayoutComposeMessageItem uid={message.item.uid} messageUID={message.item.uid} message={message.item.message} profilePic={message.item.profilePic} username={message.item.username} time={message.item.time} messageId={message.item.id} />
    }


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
                            navigation.navigate('Messages')
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
                            source={{ uri: "https://images.unsplash.com/photo-1596215143922-eedeaba0d91c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80" }}
                        />
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

            {
                isComposing ?

                    // <SearchBar
                    //     onChangeText={text => setText(text)}
                    //     placeholder="to:"
                    //     round='true'
                    //     lightTheme='true'
                    //     value={text}
                    //     containerStyle={styles.searchBarContainer}
                    //     inputContainerStyle={styles.searchBarInputContaner}
                    //     inputStyle={styles.searchBarInput}
                    //     searchIcon={styles.searchBarIcon}
                    //     clearIcon={styles.searchBarClearIcon} /> 
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
                            // onFocus={() => handleSearchOnFocus()}
                            onEndEditing={() => handleSearchEndEditing()}
                            rightIcon={!isSearchIconHidden && <Icon name="play" type='font-awesome-5' size={18} onPress={() => handleSearch()} />}
                        />
                    </KeyboardAvoidingView>
                    : null
            }



            <View style={styles.textInputContainer}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    keyExtractor={message => message.id}
                    data={ComposeMessage}
                    backgroundColor={"#fff"}
                    // initialNumToRender={3}
                    renderItem={(message) => <LayoutComposeMessageItem uid={uid} receiversUID={message.item.uid} message={message.item.message} profilePic={message.item.profilePic} username={message.item.username} time={message.item.time} messageId={message.item.id} />} />

                <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={keyboardVerticalOffset}>
                    <Input
                        value={message}
                        ref={messageRef}
                        onChangeText={message => handleMessageOnChange(message)}
                        placeholder='message'
                        fontSize={14}
                        backgroundColor={woo_white}
                        leftIcon={<Avatar
                            rounded
                            size="small"
                            source={{ uri: "https://images.unsplash.com/photo-1596215143922-eedeaba0d91c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80" }}
                        />}
                        // errorStyle={{ color: 'red' }}
                        // errorMessage={isSearchError && "sorry we couldn't find that Search"}
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