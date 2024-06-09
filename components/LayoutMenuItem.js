import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Icon } from "@rneui/themed"
import { useNavigation } from '@react-navigation/native';

const LayoutMenuItem = ({ menuItem }) => {
const navigation = useNavigation(); 
    return (
        <TouchableOpacity onPress={() =>
            navigation.navigate(`${menuItem.item.navigation}`)
        } 
        style={styles.container}>
            <Icon
                name={menuItem.item.icon}
                type='font-awesome-5'
                color="#f37320"
                size={20}
            />
            <Text style={styles.text}>{menuItem.item.text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: 'center',
        flexDirection: 'row',
        padding: 15,
    },
    text: {
        fontSize: 20,
        marginStart: 10
    }
})

export default LayoutMenuItem;
