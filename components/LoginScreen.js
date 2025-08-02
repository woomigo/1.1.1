import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Icon, Input } from "@rneui/themed";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [email, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [isTooManyRequestsError, setIsTooManyRequestsError] = useState(false);
  const [isEmailIconHidden, setEmailIconHidden] = useState(true);
  const [isPasswordIconHidden, setPasswordIconHidden] = useState(true);

  const emailRef = useRef();
  const passwordRef = useRef();
  const localhost = "http://192.168.12.240:3000";

  const clearEmailInput = () => {
    setEmailAddress("");
    emailRef.current.clear();
    emailRef.current.blur();
  };

  const clearPasswordInput = () => {
    setPassword("");
    passwordRef.current.clear();
    passwordRef.current.blur();
  };

  const handleEmailOnChange = (name) => {
    setIsEmailError(false);
    setEmailAddress(name);
  };

  const handlePasswordOnChange = (name) => {
    setIsPasswordError(false);
    setPassword(name);
  };

  const handleEmailOnFocus = () => {
    setEmailIconHidden(false);
  };

  const handlePasswordOnFocus = () => {
    setPasswordIconHidden(false);
  };

  const handleEmailEndEditing = () => {
    setEmailIconHidden(true);
  };

  const handlePasswordEndEditing = () => {
    setPasswordIconHidden(true);
  };

  const handleLogin = async () => {
    console.log("LOGIN PUSHED")
    try {
      const res = await fetch(`${localhost}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      console.log(`LOGIN INFO ${JSON.stringify(data)}`)

      if (!res.ok) {
        Alert.alert("Login Failed", data.error || "Invalid credentials");
        return;
      }

      await AsyncStorage.setItem("token", data.token);
      console.log(`DATA AT LOGIN SUBMIT IS ${JSON.stringify(data)}`);
      navigation.navigate("MoreInfo", { user: { id: 23 }, token: data.token }); // Or 'Home' if user already completed more info
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong. Try again.");
    }
  };

  const onSubmitHandler = () => {
    signInWithEmailAndPassword(auth, emailAddress, password)
      .then((userCredential) => {
        const user = userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(
          `ERROR CODE === ${errorCode} AND ERROR MESSAGE === ${errorMessage}`
        );
        if (errorCode == "auth/user-not-found") {
          setIsEmailError(true);
        }
        if (errorCode == "auth/wrong-password") {
          setIsPasswordError(true);
        }
        if (errorCode == "auth/too-many-requests") {
          setIsTooManyRequestsError(true);
        }
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.topViewStyle}>
          <Image
            style={styles.logoImageStyle}
            source={require("../assets/woomigo_v3_primary_logo.png")}
          />
        </View>
        <View style={styles.middleViewStyle}>
          <View>
            <Input
              value={email}
              ref={emailRef}
              onChangeText={(text) => handleEmailOnChange(text)}
              keyboardType="email-address"
              placeholder="email address"
              leftIcon={
                <Icon
                  style={{ paddingEnd: 5 }}
                  type="font-awesome-5"
                  name="user"
                  size={18}
                />
              }
              errorStyle={{ color: "red" }}
              errorMessage={isEmailError && "sorry we couldn't find that email"}
              autoCapitalize="none"
              onFocus={() => handleEmailOnFocus()}
              onEndEditing={() => handleEmailEndEditing()}
              rightIcon={
                !isEmailIconHidden && (
                  <Icon
                    name="close"
                    size={18}
                    onPress={() => clearEmailInput()}
                  />
                )
              }
            />
            <Input
              value={password}
              ref={passwordRef}
              onChangeText={(text) => handlePasswordOnChange(text)}
              placeholder="password"
              secureTextEntry
              leftIcon={
                <Icon
                  style={{ paddingEnd: 5 }}
                  type="font-awesome-5"
                  name="lock"
                  size={18}
                />
              }
              errorStyle={{ color: "red" }}
              errorMessage={
                isPasswordError && "incorrect password please try again"
              }
              autoCapitalize="none"
              onFocus={() => handlePasswordOnFocus()}
              onEndEditing={() => handlePasswordEndEditing()}
              rightIcon={
                !isPasswordIconHidden && (
                  <Icon
                    Icon
                    name="close"
                    size={18}
                    onPress={() => clearPasswordInput()}
                  />
                )
              }
            />
            {/* <TextInput value={emailAddress} onChangeText={text => setEmailAddress(text)} placeholder="email address" style={styles.textInputStyle} keyboardType="email-address" autoCapitalize="none" />
                        <TextInput value={password} onChangeText={text => setPassword(text)} placeholder="password" style={styles.textInputStyle} autoCapitalize="none" secureTextEntry={true} /> */}
          </View>
          <View>
            <Text
              style={styles.forgotPasswordTextStyle}
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              forgot password?
            </Text>
          </View>
          <Text style={[styles.message, { color: "red" }]}>
            {isTooManyRequestsError
              ? "Access to this account has been temporarily disabled due to many failed login attempts. Reset your password or try again later."
              : null}
          </Text>
        </View>
        <View style={styles.bottomViewStyle}>
          <View>
            <TouchableOpacity
              style={styles.loginBtnStyle}
              onPress={handleLogin}
            >
              <Text style={styles.loginBtnTextStyle}>log in</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.registerTextView}>
            <Text
              style={styles.registerTextStyle}
              onPress={() => navigation.navigate("RegisterFullname")}
            >
              register
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingRight: 30,
    paddingLeft: 30,
    backgroundColor: "#fff",
  },
  topViewStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  middleViewStyle: {
    flex: 1,
    justifyContent: "center",
  },
  bottomViewStyle: {
    flex: 1,
  },
  logoImageStyle: {
    marginTop: 40,
    height: 400,
    width: 400,
  },
  forgotPasswordTextStyle: {
    marginTop: 3,
    color: "#f37320",
  },
  loginBtnStyle: {
    backgroundColor: "#f37320",
    padding: 9,
    borderRadius: 10,
  },
  loginBtnTextStyle: {
    color: "#fff",
    textAlign: "center",
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
    borderRadius: 5,
  },
  registerTextView: {
    marginTop: 5,
    alignItems: "flex-end",
  },
});

export default LoginScreen;
