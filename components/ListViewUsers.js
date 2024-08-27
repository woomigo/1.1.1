import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, FlatList, KeyboardAvoidingView } from 'react-native'
import { Input, Icon } from "@rneui/themed";
import LayoutUserItem from "./LayoutUserItem";
import { woo_green, woo_red } from "../assets/colors";
import { list } from "firebase/storage";


const ListViewUsers = ({ returnUsers, users, kind, searchBoxPlaceholder = "search by @username", hideSearchBar, singleBtnText = "single", doubleBtn1Text = "double 1", doubleBtn2Text = "double 2", singleBtnColor = "#f37320", doubleBtn1Color = woo_green, doubleBtn2Color = woo_red, handleSingleBtnOnClick, handleDoubleBtnOneOnClick, handleDoubleBtnTwoOnClick }) => {

    const [usersSelected, setUsersSelected] = useState([]);
    const [searchValue, setSearchValue] = useState([])
    const [isSearchError, setIsSearchError] = useState()
    const [isSearchIconHidden, setSearchIconHidden] = useState(true)

    const searchRef = useRef()

    useEffect(() => {
        // console.log(`LVU USERS === ${JSON.stringify(users)}`)
    })

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

    const renderUsers = (user) => (
        <LayoutUserItem kind={kind} onCheckBoxSelected={onCheckBoxSelected} uid={user} singleBtnText={singleBtnText} doubleBtn1Text={doubleBtn1Text} doubleBtn2Text={doubleBtn2Text} singleBtnColor={singleBtnColor} doubleBtn1Color={doubleBtn1Color} doubleBtn2Color={doubleBtn2Color} handleSingleBtnOnClick={handleSingleBtnOnClick} handleDoubleBtnOneOnClick={handleDoubleBtnOneOnClick} handleDoubleBtnTwoOnClick={handleDoubleBtnTwoOnClick} />
    )

    let listOfSelectedUsers = [];

    const onCheckBoxSelected = (userId) => {
        if (listOfSelectedUsers !== undefined) {
            listOfSelectedUsers = [...usersSelected]
            if (listOfSelectedUsers.includes(userId)) {
                console.log("INCLUDES --- " + listOfSelectedUsers)
                listOfSelectedUsers.splice(listOfSelectedUsers.indexOf(userId), 1)
            } else {
                console.log("NOT INCLUDED ---- " + listOfSelectedUsers)
                listOfSelectedUsers = [...listOfSelectedUsers, userId]
            }
        }
        setUsersSelected(listOfSelectedUsers)
        returnUsers(listOfSelectedUsers)
        console.log("US +++ " + usersSelected)
    }

    return (
        <View styles={styles.container}>
            {
                hideSearchBar ? null :
                    // <SearchBar
                    //     onChangeText={text => setText(text)}
                    //     placeholder={searchBoxPlaceholder}
                    //     placeholderTextColor="#f37320"
                    //     round='true'
                    //     lightTheme='true'
                    //     value={text}
                    //     containerStyle={styles.searchBarContainer}
                    //     inputContainerStyle={styles.searchBarInputContaner}
                    //     inputStyle={styles.searchBarInput}
                    //     searchIcon={styles.searchBarIcon}
                    //     clearIcon={styles.searchBarClearIcon} />

                    <KeyboardAvoidingView behavior='position'>
                        <Input
                            value={searchValue}
                            ref={searchRef}
                            fontSize={14}
                            onChangeText={text => handleSearchOnChange(text)}
                            placeholder={searchBoxPlaceholder}
                            leftIcon={<Icon style={{ paddingEnd: 5 }} type='font-awesome-5' name='search' size={18} />}
                            // errorStyle={{ color: 'red' }}
                            // errorMessage={isSearchError && "sorry we couldn't find that Search"}
                            autoCapitalize="none"
                            // onFocus={() => handleSearchOnFocus()}
                            onEndEditing={() => handleSearchEndEditing()}
                            rightIcon={!isSearchIconHidden && <Icon name="play" type='font-awesome-5' size={18} onPress={() => handleSearch()} />}
                        />
                    </KeyboardAvoidingView>
            }
            {users &&
                <FlatList
                    showsVerticalScrollIndicator={false}
                    backgroundColor={"#fff"}
                    keyExtractor={user => user.id}
                    data={users}
                    renderItem={renderUsers}
                    initialNumToRender={3}
                    maxToRenderPerBatch={3}
                />
            }

        </View>
    )
}

const styles = StyleSheet.create({
    container: {

    },
    searchBarContainer: {
        backgroundColor: "#fff",
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent'
    },
    searchBarInputContaner: {
        backgroundColor: '#f37320',
        height: 30
    },
    searchBarInput: {
        backgroundColor: '#fff',
        color: "#000",
        paddingStart: 5,
        height: 30,
        fontSize: 12
    },
    searchBarIcon: {
        color: '#fff'
    },
    searchBarClearIcon: {
        color: '#fff'
    }
})

export default ListViewUsers;