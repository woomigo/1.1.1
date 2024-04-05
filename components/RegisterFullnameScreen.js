import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Keyboard, TouchableWithoutFeedback } from "react-native";
import { Header, Icon, LinearProgress, Input } from "@rneui/themed";
// import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterFullnameScreen = ({ navigation }) => {

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [isFirstNameError, setIsFirstNameError] = useState(false)
    const [isLastNameError, setIsLastNameError] = useState(false)
    const [isFirstNameIconHidden, setFirstNameIconHidden] = useState(true)
    const [isLastNameIconHidden, setLastNameIconHidden] = useState(true)

    // const getMyObject = async () => {
    //     try {
    //       const jsonValue = await AsyncStorage.getItem('fullname')
    //       return jsonValue != null ? JSON.parse(jsonValue) : null
    //     } catch(e) {
    //       // read error
    //     }

    //     console.log('Done.')
    //   }

    const firstNameRef = useRef()
    const lastNameRef = useRef()

    const clearFirstNameInput = () => {
        setFirstName('')
        firstNameRef.current.clear()
        firstNameRef.current.blur()
    }

    const clearLastNameInput = () => {
        setLastName('')
        lastNameRef.current.clear()
        lastNameRef.current.blur()
    }

    const handleFirstnameOnChange = (name) => {
        setIsFirstNameError(false)
        setFirstName(name)
    }

    const handleLastnameOnChange = (name) => {
        setIsLastNameError(false)
        setLastName(name)
    }

    const handleFirstNameOnFocus = () => {
        setFirstNameIconHidden(false)
    }

    const handleLastNameOnFocus = () => {
        setLastNameIconHidden(false)
    }

    const handleFirstNameEndEditing = () => {
        setFirstNameIconHidden(true)
    }

    const handleLastNameEndEditing = () => {
        setLastNameIconHidden(true)
    }

    // const storeData = async (value) => {
    //     try {
    //         const jsonValue = JSON.stringify(value);
    //         await AsyncStorage.setItem('fullname', jsonValue);
    //         console.log(`${jsonValue} STORED`)
    //     } catch (e) {
    //         console.error(e)
    //     }
    // };

    const handleNextOnClick = () => {
        console.log('NEXT CLICKED')
        if (firstName.length <= 0 || lastName.length <= 0) {
            if (firstName.length <= 0) {
                setIsFirstNameError(true)
            }
            if (lastName.length <= 0) {
                setIsLastNameError(true)
            }

        } else {
  
            navigation.navigate('RegisterDOB', { firstName: firstName, lastName: lastName })
            console.log(`${firstName} ${lastName}`)
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
                            navigation.navigate('Login')
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
                value={.2}
                color="#f37320"
                variant="determinate"
            />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={{ flex: .8, alignItems: 'center', justifyContent: 'center' }}>
                    <Input
                        label='Full Name'
                        labelStyle={{ color: 'black', marginBottom: 10 }}
                        style={{}}
                        ref={firstNameRef}
                        value={firstName}
                        onChangeText={(text) => handleFirstnameOnChange(text)}
                        placeholder='first name'
                        autoCapitalize="none"
                        errorStyle={{ color: 'red' }}
                        errorMessage={isFirstNameError && 'please add your first name'}
                        onFocus={() => handleFirstNameOnFocus()}
                        onEndEditing={() => handleFirstNameEndEditing()}
                        rightIcon={!isFirstNameIconHidden && <Icon Icon name="close" size={18} onPress={() => clearFirstNameInput()} />}
                    />
                    <Input
                        style={{ marginTop: 10 }}
                        ref={lastNameRef}
                        value={lastName}
                        onChangeText={(text) => handleLastnameOnChange(text)}
                        placeholder='last name'
                        autoCapitalize="none"
                        errorStyle={{ color: 'red' }}
                        errorMessage={isLastNameError && 'please add your last name'}
                        onFocus={() => handleLastNameOnFocus()}
                        onEndEditing={() => handleLastNameEndEditing()}
                        rightIcon={!isLastNameIconHidden && <Icon Icon name="close" size={18} onPress={() => clearLastNameInput()} />}
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

export default RegisterFullnameScreen