import { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { LinearProgress, Input, Header, Icon, Avatar } from "@rneui/themed";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebaseConfig";

const RegisterScreen = ({ route, navigation }) => {
  const { firstName, lastName, dob, username, profilePic } = route.params;

  const auth = getAuth();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const [isEmailAddressError, setIsEmailAddressError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [isReEnterPasswordError, setIsReEnterPasswordError] = useState(false);
  const [isEmailAddressIconHidden, setEmailAddressIconHidden] = useState(true);
  const [isPasswordIconHidden, setPasswordIconHidden] = useState(true);
  const [isReEnterPasswordIconHidden, setReEnterPasswordIconHidden] =
    useState(true);
  const [emailAddressErrorMessage, setEmailAddressErrorMessage] = useState("");

  const emailAddressRef = useRef();
  const passwordRef = useRef();
  const reEnterPasswordRef = useRef();

  const clearEmailAddressInput = () => {
    setEmailAddress("");
    emailAddressRef.current.clear();
    emailAddressRef.current.blur();
  };

  const clearPasswordInput = () => {
    setPassword("");
    passwordRef.current.clear();
    passwordRef.current.blur();
  };

  const clearReEnterPasswordInput = () => {
    setPassword("");
    reEnterPasswordRef.current.clear();
    reEnterPasswordRef.current.blur();
  };

  const handleEmailAddressOnChange = (email) => {
    setIsEmailAddressError(false);
    setEmailAddress(email);
  };

  const handlePasswordOnChange = (password) => {
    setIsPasswordError(false);
    setPassword(password);
  };

  const handleReEnterPasswordOnChange = (password) => {
    setIsReEnterPasswordError(false);
    setReEnterPassword(password);
  };

  const handleEmailAddressOnFocus = () => {
    setEmailAddressIconHidden(false);
  };

  const handlePasswordOnFocus = () => {
    setPasswordIconHidden(false);
  };

  const handleReEnterPasswordOnFocus = () => {
    setReEnterPasswordIconHidden(false);
  };

  const handleEmailAddressEndEditing = () => {
    setEmailAddressIconHidden(true);
  };

  const handlePasswordEndEditing = () => {
    setPasswordIconHidden(true);
  };

  const handleReEnterPasswordEndEditing = () => {
    setReEnterPasswordIconHidden(true);
  };

  const handleOnSubmit = () => {
    console.log("NEXT CLICKED");
    if (password != reEnterPassword) {
      setIsReEnterPasswordError(true);
    } else {
      console.log("UPLOAD IMAGE");
      uploadImage(profilePic);
    }
  };

  const uploadImage = async (uri, fileType) => {
    console.log("UPLOAD IMAGESSSS");
    const res = await fetch(uri);
    if (res.ok) {
      const blobImage = await res.blob();
      console.log("BLOB");
      const storageRef = ref(
        storage,
        "user_profile/" + username + new Date().getTime()
      );
      console.log("SR");
      const uploadTask = uploadBytesResumable(storageRef, blobImage);
      console.log("UT");
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageStorageProgress(progress.toFixed());
        },
        (error) => {
          console.error(`UPLOAD IMAGE TO STORAGE ERROR === ${error}`);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
            console.log(url);
            registerUser(url);
          });
        }
      );
    }
  };

  const registerUser = (profilePicURL) => {
    createUserWithEmailAndPassword(auth, emailAddress, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log("Successfully Registered");
        setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          first_name: firstName,
          last_name: lastName,
          username: username,
          dob: dob,
          profile_pic_url: profilePicURL,
          migos: [],
          followers: [],
          following: [],
          is_private_profile: false,
          received_migo_requests: [],
          sent_migo_requests: [],
          gallery: [],
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`ERROR ${errorCode} ---- ${errorMessage}`);
        if (errorCode == "auth/email-already-exists") {
          isEmailAddressError(true);
          setEmailAddressErrorMessage("email address already exists");
        }
        if (errorCode == "auth/invalid-email") {
          isEmailAddressError(true);
          setEmailAddressErrorMessage(
            "invalid email. please check your email address"
          );
        }
        if (errorCode == "auth/invalid-password") {
          setIsPasswordError(true);
        }
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
            color="#f37320"
            size={25}
            onPress={() =>
              navigation.navigate("RegisterProfilePicture", {
                firstName: firstName,
                lastName: lastName,
                dob: dob,
                username: username,
              })
            }
          />
        }
        centerComponent={
          <View>
            <Text
              style={{
                fontSize: 25,
                color: "#f37320",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              register
            </Text>
          </View>
        }
        leftContainerStyle={styles.leftComponent}
        centerContainerStyle={styles.centerComponent}
      />

      {/* <LinearProgress
                style={{}}
                value={1}
                color="#f37320"
                variant="determinate"
            /> */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 0.2, alignItems: "center", marginTop: 25 }}>
            <Avatar
              rounded
              size="large"
              source={{ uri: profilePic }}
              // source={{ uri: image }}
            />
          </View>
          <View
            style={{
              flex: 0.2,
              justifyContent: "flex-start",
              padding: 10,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{ fontSize: 16, fontWeight: "bold" }}
              >{`fullname: `}</Text>
              <Text style={{ fontSize: 16 }}>
                {firstName} {lastName}
              </Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text
                style={{ marginTop: 15, fontSize: 16, fontWeight: "bold" }}
              >{`dob: `}</Text>
              <Text style={{ marginTop: 15, fontSize: 16 }}>{dob}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{ marginTop: 15, fontSize: 16, fontWeight: "bold" }}
              >{`username: `}</Text>
              <Text style={{ marginTop: 15, fontSize: 16 }}>{username}</Text>
            </View>
          </View>

          <View
            style={{
              flex: 0.5,
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Input
              label="email and password"
              labelStyle={{ color: "black", marginBottom: 10 }}
              style={{}}
              ref={emailAddressRef}
              value={emailAddress}
              onChangeText={(text) => handleEmailAddressOnChange(text)}
              placeholder="email address"
              keyboardType="email-address"
              autoCapitalize="none"
              errorStyle={{ color: "red" }}
              errorMessage={isEmailAddressError && emailAddressErrorMessage}
              onFocus={() => handleEmailAddressOnFocus()}
              onEndEditing={() => handleEmailAddressEndEditing()}
              rightIcon={
                !isEmailAddressIconHidden && (
                  <Icon
                    Icon
                    name="close"
                    size={18}
                    onPress={() => clearEmailAddressInput()}
                  />
                )
              }
            />

            <Input
              style={{ marginTop: 10 }}
              ref={passwordRef}
              value={password}
              onChangeText={(text) => handlePasswordOnChange(text)}
              placeholder="password"
              autoCapitalize="none"
              secureTextEntry
              errorStyle={{ color: "red" }}
              errorMessage={isPasswordError && "please add your last name"}
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

            <Input
              style={{ marginTop: 10 }}
              ref={reEnterPasswordRef}
              value={reEnterPassword}
              onChangeText={(text) => handleReEnterPasswordOnChange(text)}
              placeholder="re-enter password"
              autoCapitalize="none"
              secureTextEntry
              errorStyle={{ color: "red" }}
              errorMessage={isReEnterPasswordError && "passwords don't match"}
              onFocus={() => handleReEnterPasswordOnFocus}
              onEndEditing={() => handleReEnterPasswordEndEditing()}
              rightIcon={
                !isReEnterPasswordIconHidden && (
                  <Icon
                    Icon
                    name="close"
                    size={18}
                    onPress={() => clearReEnterPasswordInput()}
                  />
                )
              }
            />
          </View>
          <View style={styles.bottomViewStyle}>
            <View>
              <TouchableOpacity
                style={styles.loginBtnStyle}
                onPress={() => handleOnSubmit()}
              >
                <Text style={styles.loginBtnTextStyle}>register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingRight: 30,
    paddingLeft: 30,
  },
  bottomViewStyle: {
    flex: 0.5,
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
});

export default RegisterScreen;
