import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TextInput, SafeAreaView, Image, FlatList } from "react-native";
import { Header, Icon, SearchBar, Avatar } from "@rneui/themed";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LayoutComposeMessageItem from "./LayoutComposeMessageItem";
import { ComposeMessage } from "./shared";
import LayoutInputText from "./LayoutInputText";



const ComposeMessageScreen = ({ route, navigation }) => {
    const insets = useSafeAreaInsets();
    const [text, setText] = useState('');
    const [uid, setUid] = useState(134)
    const [isComposing, setIsComposing] = useState(false);
    
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
                        color="#f37320"
                        size={25}
                        onPress={() =>
                            navigation.navigate('Messages')
                        }
                    />}
                centerComponent={
                    <View>
                    {isComposing ? <Text style={styles.headerCenterText}>compose</Text> :
                        <Avatar
                            rounded
                            size="small"
                            onPress={() =>
                                navigate('ProfileComponent')
                            }
                            source={{ uri: "https://images.unsplash.com/photo-1615813967515-e1838c1c5116?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80" }}
                        />

                    }
                </View>
                }
                // rightComponent={

                // }
                rightContainerStyle={styles.rightComponent}
                leftContainerStyle={styles.leftComponent}
                centerContainerStyle={styles.centerComponent}
            />
           
            {
                isComposing ? <SearchBar
                    onChangeText={text => setText(text)}
                    placeholder="to:"
                    round='true'
                    lightTheme='true'
                    value={text}
                    containerStyle={styles.searchBarContainer}
                    inputContainerStyle={styles.searchBarInputContaner}
                    inputStyle={styles.searchBarInput}
                    searchIcon={styles.searchBarIcon}
                    clearIcon={styles.searchBarClearIcon} /> : null
            }



            <View style={styles.textInputContainer}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    keyExtractor={message => message.id}
                    data={ComposeMessage}
                    backgroundColor={"#fff"}
                    // initialNumToRender={3}
                    renderItem={(message) => <LayoutComposeMessageItem uid={uid} receiversUID={message.item.uid} message={message.item.message} profilePic={message.item.profilePic} username={message.item.username} time={message.item.time} messageId={message.item.id} />} />

                <LayoutInputText />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 4,
    },
    headerCenterText: {
        fontSize: 18,
        color: "#f37320",
        fontWeight: 'bold'
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
        flex: 1,
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
    },
})

export default ComposeMessageScreen;