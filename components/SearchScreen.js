import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from "react-native";
import { Header, Icon, Input, Avatar, Skeleton } from "@rneui/themed";
import { woo_black, woo_gray, woo_green, woo_white } from '../assets/colors';
import LayoutUserItem from './LayoutUserItem';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, updateDoc, arrayUnion, doc } from "firebase/firestore";
import { FlatList } from 'react-native';
import ListViewUsers from './ListViewUsers';
import { SelfIdentity } from './shared';
import { render } from 'react-native-web';

const SearchScreen = ({ navigation, route, }) => {

    const { uid } = route.params

    useEffect(() => {
        console.log(' UID === ' + uid)
    })

    const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 0

    const [searchValue, setSearchValue] = useState([])
    const [user, setUser] = useState()
    const [isSearchError, setIsSearchError] = useState()
    const [isSearchIconHidden, setSearchIconHidden] = useState(true)
    const [isUserExists, setIsUserExists] = useState()
    const [view, setView] = useState("following")

    const searchRef = useRef()

    const userRef = doc(db, "users", uid);
    // const searchUserRef = ;

    const addUIDToFollowing = async () => {
        await updateDoc(userRef, {
            following: arrayUnion(user.uid)
        });
        // setView("success")
        // navigation.popToTop();
        // navigation.navigate('Profile')
    }
    const addUIDToFollowers = async () => {
        await updateDoc(doc(db, "users", user.uid), {
            followers: arrayUnion(uid)
        })
        setView("success")
        // navigation.popToTop();
        // navigation.navigate('Profile')
    }

    const handleFollowUser = () => {
        console.log(`FOLLOW!!!! ${user.username}`)
        setView("loading")
        if (user.profile_visibility === "public") {
            addUIDToFollowing()
            addUIDToFollowers()
        }
    }

    const handleUserFollowed = () => {
        console.log("YUP IT WORKED!!!")
    }

    const handleSearchOnFocus = () => {
        setUser()
        setView('following')
    }

    const handleSearch = async () => {
        console.log("SEARCH")
        const q = query(collection(db, "users"), where("username", "==", searchValue));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data().followers);
            setUser(doc.data())
            if (doc.data().followers.includes(uid)) {
                setView('success')
            }
        });
        console.log("view is " + view)
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
        console.log('BLUR!')
        searchRef.current.blur()
        Keyboard.dismiss()
    }

    const handleSearchEndEditing = () => {
        console.log("END EDITING!!!")
        setSearchIconHidden(true)
    }

    const renderView = (view) => {
        switch (view) {
            case 'following':
                return <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: woo_gray }]}
                    onPress={() => handleFollowUser()}
                ><Text style={styles.buttonText}>follow</Text>
                </TouchableOpacity>
            case 'loading':
                return <Skeleton
                    // LinearGradientComponent={LinearGradient}
                    animation="wave"
                    width={80}
                    height={30}
                    borderRadius={10}
                />;
            case 'success':
                return <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: woo_green }]}
                    onPress={() => handleUserFollowed()}
                ><Text style={styles.buttonText}>following!</Text>
                </TouchableOpacity>
            default:
                return '';
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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

                <Input
                    value={searchValue}
                    ref={searchRef}
                    onChangeText={text => handleSearchOnChange(text)}
                    placeholder='search users by @username'
                    fontSize={14}
                    backgroundColor={woo_white}
                    leftIcon={<Icon style={{ paddingEnd: 5 }} type='font-awesome-5' name='search' size={18} />}
                    // errorStyle={{ color: 'red' }}
                    // errorMessage={isSearchError && "sorry we couldn't find that Search"}
                    autoCapitalize="none"
                    onFocus={() => handleSearchOnFocus()}
                    onBlur={() => handleOnBlur()}
                    onEndEditing={() => handleSearchEndEditing()}
                    rightIcon={!isSearchIconHidden && <Icon name="play" type='font-awesome-5' size={18} onPress={() => handleSearch()} />}
                />


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
                                {renderView(view)}
                            </View>
                        </View>
                    :
                    null
                }

            </View>
        </TouchableWithoutFeedback>
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