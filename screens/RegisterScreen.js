import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import firebaseConfig from '../firebaseConfig';
import Button from '../components/Button';

const RegisterScreen = ({ navigation }) => {

    const app = initializeApp(firebaseConfig);
    const auth = getAuth();
    const db = getFirestore(app);

    // const date = new Date();
    // const year = date.getFullYear();
    // const month = date.getMonth();
    // const day = date.getDate();

    // const dobMaximumDate = new Date(year - 13, month, day) // Today's date minus 13 YEARS

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [reEnterPassword, setReEnterPassword] = useState('');
    // const [isError, setIsError] = useState(false);
    // const [dob, setDob] = useState(dobMaximumDate);
    const [showWarningMessage, setShowWarningMessage] = useState(false);

    // useEffect(() => {
    //     console.log(`REGISTER UID === ${uid}`)
    // }, [uid]);

    const registerUser = () => {
        createUserWithEmailAndPassword(auth, emailAddress, password)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                console.log('Successfully Registered')
                setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    username: "",
                    dob: "",
                    profilePicURL: ""
                  });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(`ERROR ${errorCode} ---- ${errorMessage}`)
                // ..
            });
    }

    return (
        <View style={styles.container}>
            <View style={styles.topViewStyle}>
                <Text style={styles.registerHeaderTextStyle}>register</Text>
            </View>
            <View style={styles.middleViewStyle}>
                <View>
                    <TextInput value={emailAddress} onChangeText={text => setEmailAddress(text)} placeholder="email address" style={styles.textInputStyle} keyboardType="email-address" autoCapitalize="none" />
                    <TextInput value={password} onChangeText={text => setPassword(text)} placeholder="password" style={styles.textInputStyle} utoCapitalize="none" secureTextEntry={true} />
                    {showWarningMessage ? <Text style={styles.pwErrorMatchText}>passwords must match</Text> : null}
                    <TextInput value={reEnterPassword} onChangeText={text => setReEnterPassword(text)} placeholder="re-enter password" style={styles.textInputStyle} utoCapitalize="none" secureTextEntry={true} />
                    {showWarningMessage ? <Text style={styles.pwErrorMatchText}>passwords must match</Text> : null}
                </View>
            </View>
            <View style={styles.bottomViewStyle}>
                <Button buttonText={'register'} onSubmit={registerUser}/>
                <View style={styles.registerTextView}>
                    <Text style={styles.signInTextStyle} onPress={() =>
                        navigation.navigate('Login')
                    }>sign in</Text>
                </View>
            </View>
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