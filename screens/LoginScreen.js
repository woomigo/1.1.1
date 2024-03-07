import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import Button from "../components/Button";
import TextInput from "../components/TextInput";

const LoginScreen = ({navigation}) => {

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');



    const onSubmitHandler = () => {
    signInWithEmailAndPassword(auth, emailAddress, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setMessage(`welcome!`)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setIsError(true)
        setMessage(errorMessage)
      });
    }

    const getMessage = () => {
        const status = isError ? `error: ` : `success: `;
        return status + message;
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <View style={styles.topViewStyle}>
                    <Image
                        style={styles.logoImageStyle}
                        source={require('../assets/woomigo_v3_primary_logo.png')} />
                </View>
                <View style={styles.middleViewStyle}>

                    <View>
                        <TextInput value={emailAddress} onChange={text=> setEmailAddress(text)} placeholder={"email address"} type={"email-address"} />
                        <TextInput value={password} onChange={text => setPassword(text)} placeholder={"password"} secure={true}/>
                        <Text style={[styles.message, { color: 'red' }]}>{message ? getMessage() : null}</Text>
                    </View>
                    <View>
                        <Text style={styles.forgotPasswordTextStyle}>forgot password?</Text>
                    </View>
                </View>
                <View style={styles.bottomViewStyle}>
                    <View>
                        <Button buttonText={"log in"} onSubmit={onSubmitHandler} />
                     
                    </View>
                    <View style={styles.registerTextView}>
                        <Text style={styles.registerTextStyle} onPress={() =>
                            navigation.navigate('Register')
                        }>register</Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingRight: 30,
        paddingLeft: 30,
        backgroundColor: "#fff"
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
    logoImageStyle: {
        marginTop: 40,
        height: 400,
        width: 400
    },
    forgotPasswordTextStyle: {
        color: "#f37320"
    },
    loginBtnStyle: {
        backgroundColor: "#f37320",
        padding: 9,
        borderRadius: 10
    },
    loginBtnTextStyle: {
        color: "#fff",
        textAlign: 'center'
    },
    registerTextStyle: {
        color: "#f37320",

    },
    textInputStyle: {
        borderWidth: 1,
        borderColor: "#f37320",
        marginBottom: 10,
        padding: 5,
        paddingLeft: 10,
        borderRadius: 5
    },
    registerTextView: {
        marginTop: 5,
        alignItems: 'flex-end'
    }

})

export default LoginScreen;