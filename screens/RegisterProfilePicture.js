import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Keyboard, TouchableWithoutFeedback } from "react-native";
import { Header, Icon, LinearProgress, Input } from "@rneui/themed";

const RegisterProfilePictureScreen = ({ navigation }) => {

    const [username, setUsername] = useState('')
    const [isUsernameError, setIsUsernameError] = useState(false)
    const [isUsernameIconHidden, setUsernameIconHidden] = useState(true)

    const usernameRef = useRef()

    const clearUsernameInput = () => {
        setUsername('')
        usernameRef.current.clear()
        usernameRef.current.blur()
    }

    const handleUsernameOnChange = (username) => {
        setIsUsernameError(false)
        setUsername(username)
    }

    const handleUsernameOnFocus = () => {
        setUsernameIconHidden(false)
    }

    const handleUsernameEndEditing = () => {
        setUsernameIconHidden(true)
    }

    const handleNextOnClick = () => {
        console.log('NEXT CLICKED')
        if (username.length <= 0) {
            setIsUsernameError(true)
        } else {
            navigation.navigate('RegisterProfilePicture')
            console.log(`${username}`)
        }
    }

    return (
        <View style={styles.container}>
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
                            navigation.navigate('RegisterDOB')
                        }
                    />}
                centerComponent={
                    <View >
                        <Text style={{ fontSize: 25, color: "#f37320", textAlign: 'center', fontWeight: 'bold' }}>register</Text>
                    </View>
                }
                rightComponent={
                    <Icon
                        name="chevron-right"
                        type='font-awesome-5'
                        color="#f37320"
                        size={25}
                        onPress={() => handleNextOnClick()}
                    />
                }
                rightContainerStyle={styles.rightComponent}
                leftContainerStyle={styles.leftComponent}
                centerContainerStyle={styles.centerComponent}
            />
            <LinearProgress
                style={{}}
                value={.8}
                color="#f37320"
                variant="determinate"
            />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={{ flex: .8, alignItems: 'center', justifyContent: 'center' }}>
                    <Input
                        label='username'
                        labelStyle={{ color: 'black', marginBottom: 10 }}
                        style={{}}
                        ref={usernameRef}
                        value={username}
                        onChangeText={(text) => handleUsernameOnChange(text)}
                        placeholder='@username'
                        autoCapitalize="none"
                        errorStyle={{ color: 'red' }}
                        errorMessage={isUsernameError && 'username already exists'}
                        onFocus={() => handleUsernameOnFocus()}
                        onEndEditing={() => handleUsernameEndEditing()}
                        rightIcon={!isUsernameIconHidden && <Icon Icon name="close" size={18} onPress={() => clearUsernameInput()} />}
                    />
                </View>
            </TouchableWithoutFeedback>
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
})

export default RegisterProfilePictureScreen