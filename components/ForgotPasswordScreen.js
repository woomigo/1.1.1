import { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import {
  Header,
  Icon,
  Input,
  LinearProgress,
  Avatar,
  Button,
} from "@rneui/themed";
import { woo_black, woo_orange, woo_white } from "../assets/colors";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebaseConfig";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isEmailError, setIsEmailError] = useState(false);
  const [isEmailIconHidden, setEmailIconHidden] = useState(true);

  const forgotPasswordInputRef = useRef();

  const clearEmailInput = () => {
    setEmail("");
    forgotPasswordInputRef.current.clear();
    forgotPasswordInputRef.current.blur();
  };

  const handleEmailOnChange = (email) => {
    setIsEmailError(false);
    setEmail(email);
  };

  const handleEmailOnFocus = () => {
    setEmailIconHidden(false);
  };

  const handleEmailEndEditing = () => {
    setEmailIconHidden(true);
  };

  const handleSubmit = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        // ..

        navigation.navigate("Login");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setIsEmailError(true);
        setErrorMessage(errorMessage);
        // ..
      });
  };

  return (
    <View style={styles.container}>
      <Header
        style={styles.header}
        backgroundColor={"#fff"}
        leftComponent={
          <Icon
            name="chevron-left"
            type="font-awesome-5"
            color={woo_black}
            size={25}
            onPress={() => navigation.navigate("Login")}
          />
        }
        centerComponent={
          <View>
            <Text
              style={{
                fontSize: 25,
                color: woo_black,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              forgot password
            </Text>
          </View>
        }
        leftContainerStyle={styles.leftComponent}
        centerContainerStyle={styles.centerComponent}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View
          style={{
            flex: 0.5,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Input
            label="email"
            labelStyle={{ color: "black", marginBottom: 10 }}
            style={{}}
            ref={forgotPasswordInputRef}
            value={email}
            onChangeText={(text) => handleEmailOnChange(text)}
            placeholder="enter email used to register"
            autoCapitalize="none"
            errorStyle={{ color: "red" }}
            errorMessage={isEmailError && errorMessage}
            onFocus={() => handleEmailOnFocus()}
            onEndEditing={() => handleEmailEndEditing()}
            rightIcon={
              !isEmailIconHidden && (
                <Icon
                  Icon
                  name="close"
                  size={18}
                  onPress={() => clearEmailInput()}
                />
              )
            }
          />
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.bottomViewStyle}>
        <TouchableOpacity
          style={styles.loginBtnStyle}
          onPress={() => handleSubmit()}
        >
          <Text style={styles.loginBtnTextStyle}>submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: woo_white,
  },
  header: {
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.2,
    elevation: 4,
  },
  leftComponent: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerComponent: {
    justifyContent: "center",
    alignItems: "center",
  },
  rightComponent: {
    justifyContent: "center",
    alignItems: "center",
  },
  bottomViewStyle: {
    // flex: 0.1,
  },
  loginBtnStyle: {
    backgroundColor: "#f37320",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  loginBtnTextStyle: {
    color: "#fff",
    textAlign: "center",
  },
});

export default ForgotPasswordScreen;
