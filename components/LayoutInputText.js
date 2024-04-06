import React from 'react'
import { View, StyleSheet, Image, TextInput } from 'react-native'


const LayoutInputText = () => {
    return (
        <View style={styles.sectionStyle}>
            <Image
                source={{ uri: "https://images.unsplash.com/photo-1596215143922-eedeaba0d91c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80" }}
                style={styles.ImageStyle}
            />
            <TextInput
                style={{ flex: 1, color: '#fff', fontSize: 12 }}
                placeholder="write a comment here..."
                underlineColorAndroid="transparent"
                placeholderTextColor="#fff"
                autoCapitalize="none"
                autoCorrect={false}
                multiline={true}
            />
        </View>
    )
}

const styles = StyleSheet.create({
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
    }
})

export default LayoutInputText