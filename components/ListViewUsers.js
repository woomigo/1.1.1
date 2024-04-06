import React, { useState } from "react";
import { View, StyleSheet, FlatList } from 'react-native'
import { SearchBar } from "@rneui/themed";
import LayoutUserItem from "./LayoutUserItem";


const ListViewUsers = ({ users, kind, searchBoxPlaceholder = "placeholder", hideSearchBar, singleBtnText = "single", doubleBtn1Text = "double 1", doubleBtn2Text = "double 2", singleBtnColor = "#f37320", doubleBtn1Color = "#00c04b", doubleBtn2Color = "#df2c14",  }) => {
    const [usersSelected, setUsersSelected] = useState([]);
    const [text, setText] = useState('');

    const renderUsers = (user) => (
        <LayoutUserItem kind={kind} onCheckBoxSelected={onCheckBoxSelected} user={user} singleBtnText={singleBtnText} doubleBtn1Text={doubleBtn1Text} doubleBtn2Text={doubleBtn2Text} singleBtnColor={singleBtnColor} doubleBtn1Color={doubleBtn1Color} doubleBtn2Color={doubleBtn2Color} />
    )

    const onCheckBoxSelected = (userId) => {
        console.log(`user id is ${userId}`)
        setUsersSelected(selectedusers => [...selectedusers, userId])
        console.log(`users selected =====s ${usersSelected}`)
    }

    const returnUsersSelected = () => {
        return usersSelected;
    }

    return (
        <View styles={styles.container}>
            {
                hideSearchBar ? null :
                    <SearchBar
                        onChangeText={text => setText(text)}
                        placeholder={searchBoxPlaceholder}
                        placeholderTextColor="#f37320"
                        round='true'
                        lightTheme='true'
                        value={text}
                        containerStyle={styles.searchBarContainer}
                        inputContainerStyle={styles.searchBarInputContaner}
                        inputStyle={styles.searchBarInput}
                        searchIcon={styles.searchBarIcon}
                        clearIcon={styles.searchBarClearIcon} />
            }
            <FlatList
                showsVerticalScrollIndicator={false}
                backgroundColor={"#fff"}
                keyExtractor={user => user.id}
                data={users}
                renderItem={renderUsers}
                initialNumToRender={3}
                maxToRenderPerBatch={3}
            />
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