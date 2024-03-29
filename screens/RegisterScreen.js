import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { LinearProgress, Input, Header, Icon, Avatar } from '@rneui/themed';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import firebaseConfig from '../firebaseConfig';


const RegisterScreen = ({ route, navigation }) => {

    const { firstName, lastName, dob, username, profilePic } = route.params;

    const app = initializeApp(firebaseConfig);
    const auth = getAuth();
    const db = getFirestore(app);

    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')
    const [reEnterPassword, setReEnterPassword] = useState('')
    const [isEmailAddressError, setIsEmailAddressError] = useState(false)
    const [isPasswordError, setIsPasswordError] = useState(false)
    const [isReEnterPasswordError, setIsReEnterPasswordError] = useState(false)
    const [isEmailAddressIconHidden, setEmailAddressIconHidden] = useState(true)
    const [isPasswordIconHidden, setPasswordIconHidden] = useState(true)
    const [isReEnterPasswordIconHidden, setReEnterPasswordIconHidden] = useState(true)
    const [emailAddressErrorMessage, setEmailAddressErrorMessage] = useState('')

    const emailAddressRef = useRef()
    const passwordRef = useRef()
    const reEnterPasswordRef = useRef()

    const clearEmailAddressInput = () => {
        setEmailAddress('')
        emailAddressRef.current.clear()
        emailAddressRef.current.blur()
    }

    const clearPasswordInput = () => {
        setPassword('')
        passwordRef.current.clear()
        passwordRef.current.blur()
    }

    const clearReEnterPasswordInput = () => {
        setPassword('')
        reEnterPasswordRef.current.clear()
        reEnterPasswordRef.current.blur()
    }

    const handleEmailAddressOnChange = (email) => {
        setIsEmailAddressError(false)
        setEmailAddress(email)
    }

    const handlePasswordOnChange = (password) => {
        setIsPasswordError(false)
        setPassword(password)
    }

    const handleReEnterPasswordOnChange = (password) => {
        setIsReEnterPasswordError(false)
        setReEnterPassword(password)
    }

    const handleEmailAddressOnFocus = () => {
        setEmailAddressIconHidden(false)
    }

    const handlePasswordOnFocus = () => {
        setPasswordIconHidden(false)
    }

    const handleReEnterPasswordOnFocus = () => {
        setReEnterPasswordIconHidden(false)
    }

    const handleEmailAddressEndEditing = () => {
        setEmailAddressIconHidden(true)
    }

    const handlePasswordEndEditing = () => {
        setPasswordIconHidden(true)
    }

    const handleReEnterPasswordEndEditing = () => {
        setReEnterPasswordIconHidden(true)
    }

    const handleNextOnClick = () => {
        console.log('NEXT CLICKED')
        if (password != reEnterPassword) {
            setIsReEnterPasswordError(true)
        } else {
            registerUser()
        }
    }

    const registerUser = () => {
        createUserWithEmailAndPassword(auth, emailAddress, password)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                console.log('Successfully Registered')
                setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    firstName: firstName,
                    lastName: lastName,
                    username: username,
                    dob: dob,
                    profilePicURL: "https://images.unsplash.com/photo-1596215143922-eedeaba0d91c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80"
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(`ERROR ${errorCode} ---- ${errorMessage}`)
                if (errorCode == 'auth/email-already-exists') {
                    isEmailAddressError(true)
                    setEmailAddressErrorMessage('email address already exists')
                }
                if (errorCode == 'auth/invalid-email') {
                    isEmailAddressError(true)
                    setEmailAddressErrorMessage('invalid email. please check your email address')
                }
                if (errorCode == 'auth/invalid-password') {
                    setIsPasswordError(true)
                }
            });
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
                            navigation.navigate('RegisterProfilePicture', {firstName: firstName, lastName: lastName, dob: dob, username: username})
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
                value={1}
                color="#f37320"
                variant="determinate"
            />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: .2, alignItems: 'center', marginTop: 15 }}>
                        <Text style={{ marginBottom: 5, fontSize: 16, fontWeight: 'bold' }}>{`profile picture:`}</Text>
                        <Avatar rounded size="large"
                            source={{ uri: profilePic }}
                        // source={{ uri: image }} 
                        />
                    </View>
                    <View style={{ flex: .2, justifyContent: 'flex-start', }}>
                        <Text style={{ marginTop: 5, fontSize: 16, fontWeight: 'bold' }}>{`fullname: ${firstName} ${lastName}`}</Text>
                        <Text style={{ marginTop: 5, fontSize: 16, fontWeight: 'bold' }}>{`date of birth: ${dob}`}</Text>
                        <Text style={{ marginTop: 5, fontSize: 16, fontWeight: 'bold' }}>{`username: ${username}`}</Text>
                    </View>


                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', }}>
                        <Input
                            label='email and password'
                            labelStyle={{ color: 'black', marginBottom: 10 }}
                            style={{}}
                            ref={emailAddressRef}
                            value={emailAddress}
                            onChangeText={(text) => handleEmailAddressOnChange(text)}
                            placeholder='email address'
                            keyboardType="email-address"
                            autoCapitalize="none"
                            errorStyle={{ color: 'red' }}
                            errorMessage={isEmailAddressError && emailAddressErrorMessage}
                            onFocus={() => handleEmailAddressOnFocus()}
                            onEndEditing={() => handleEmailAddressEndEditing()}
                            rightIcon={!isEmailAddressIconHidden && <Icon Icon name="close" size={18} onPress={() => clearEmailAddressInput()} />}
                        />

                        <Input
                            style={{ marginTop: 10 }}
                            ref={passwordRef}
                            value={password}
                            onChangeText={(text) => handlePasswordOnChange(text)}
                            placeholder='password'
                            autoCapitalize="none"
                            secureTextEntry
                            errorStyle={{ color: 'red' }}
                            errorMessage={isPasswordError && 'please add your last name'}
                            onFocus={() => handlePasswordOnFocus()}
                            onEndEditing={() => handlePasswordEndEditing()}
                            rightIcon={!isPasswordIconHidden && <Icon Icon name="close" size={18} onPress={() => clearPasswordInput()} />}
                        />

                        <Input
                            style={{ marginTop: 10 }}
                            ref={reEnterPasswordRef}
                            value={reEnterPassword}
                            onChangeText={(text) => handleReEnterPasswordOnChange(text)}
                            placeholder='re-enter password'
                            autoCapitalize="none"
                            secureTextEntry
                            errorStyle={{ color: 'red' }}
                            errorMessage={isReEnterPasswordError && "passwords don't match"}
                            onFocus={() => handleReEnterPasswordOnFocus}
                            onEndEditing={() => handleReEnterPasswordEndEditing()}
                            rightIcon={!isReEnterPasswordIconHidden && <Icon Icon name="close" size={18} onPress={() => clearReEnterPasswordInput()} />}
                        />

                    </View>
                </View>

            </TouchableWithoutFeedback>
        </View >
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingRight: 30,
        paddingLeft: 30,

    },
    topViewStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    middleViewStyle: {
        flex: 1,
        justifyContent: 'center'
    },
    bottomViewStyle: {
        flex: 1,
    },
    registerHeaderTextStyle: {
        fontSize: 24,
        color: '#f37320'
    },
    registerBtnStyle: {
        backgroundColor: '#f37320',
        padding: 9,
        borderRadius: 10,
        marginTop: 80
    },
    registerBtnTextStyle: {
        color: '#fff',
        textAlign: 'center'
    },
    signInTextStyle: {
        color: '#f37320',

    },
    textInputStyle: {
        borderWidth: 1,
        backgroundColor: '#fff',
        borderColor: '#f37320',
        marginTop: 10,
        padding: 5,
        paddingLeft: 10,
        borderRadius: 5
    },
    pwErrorMatchText: {
        color: 'red',
        fontSize: 12
    },
    registerTextView: {
        marginTop: 5,
        alignItems: 'flex-end'
    }
})

export default RegisterScreen;