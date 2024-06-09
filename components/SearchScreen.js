import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { Header, Icon, Input, Avatar } from "@rneui/themed";
import { woo_black, woo_gray } from '../assets/colors';
import LayoutUserItem from './LayoutUserItem';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs } from "firebase/firestore";
import { FlatList } from 'react-native';
import ListViewUsers from './ListViewUsers';

const SearchScreen = ({ navigation, route, }) => {

    const {uid} = route.params

    useEffect(() => {
        console.log(' UID === ' + uid)
    })

    const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 0

    const [searchValue, setSearchValue] = useState([])
    const [user, setUser] = useState()
    const [isSearchError, setIsSearchError] = useState()
    const [isSearchIconHidden, setSearchIconHidden] = useState(true)

    const searchRef = useRef()

    const handleFollowUser = () => {
        console.log("FOLLOW!!!!")
    }

    const handleSearchOnFocus = () => {
        setUser()
    }

    const handleSearch = async () => {
        console.log("SEARCH")
        const q = query(collection(db, "users"), where("username", "==", searchValue));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            setUser(doc.data())
        });
        console.log("SEARCH HERE")
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

    const handleOnBlur = () => {
        searchRef.current.blur()
    }

    const handleSearchEndEditing = () => {
        setSearchIconHidden(true)
    }

    return (
        <View style={styles.container}>
            <Header
                containerStyle={styles.header}
                backgroundColor={'#fff'}
                // leftComponent={

                //   }
                centerComponent={
                    <View >
                        <Text style={{ fontSize: 25, color: woo_black, textAlign: 'center', fontWeight: 'bold' }}>search</Text>
                    </View>
                }
                // rightComponent={

                // }
                rightContainerStyle={styles.rightComponent}
                leftContainerStyle={styles.leftComponent}
                centerContainerStyle={styles.centerComponent}
            />
            <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={keyboardVerticalOffset}>
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
                    onBlur={() => handleOnBlur()}
                    onEndEditing={() => handleSearchEndEditing()}
                    rightIcon={!isSearchIconHidden && <Icon name="play" type='font-awesome-5' size={18} onPress={() => handleSearch()} />}
                />
            </KeyboardAvoidingView>

            {user &&
                <View style={styles.userInfoContainer}>
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
                        <TouchableOpacity
                            style={[styles.addButton, { backgroundColor: woo_gray }]}
                            onPress={() => handleFollowUser()}
                        ><Text style={styles.buttonText}>follow</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
        </View>

    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    profileInfo: {
        textAlign: 'center'
    },
    header: {
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 3 },
        shadowOpacity: 0.2,
        elevation: 4,
    },
    leftComponent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerComponent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightComponent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    userInfoContainer: {
        // flex: 1,
        backgroundColor: "#fff",
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
    addButton: {
        backgroundColor: '#f37320',
        padding: 5,
        borderRadius: 10,
        width: 80
    },
    buttonText: {
        color: "#fff",
        textAlign: 'center'
    },
    requestButtonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
    }
})

export default SearchScreen