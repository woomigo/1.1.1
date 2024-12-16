import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Avatar, Header, Icon, Input } from "@rneui/themed";
import { woo_black, woo_white } from "../assets/colors";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const EditProfileScreen = ({ route, navigation }) => {
  const { uid } = route.params;

  const userRef = doc(db, "users", uid);

  const [user, setUser] = useState();
  const [username, setUsername] = useState("");
  const [profilePicURL, setProfilePicURL] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [isUsernameError, setIsUsernameError] = useState(false);
  const [isUsernameIconHidden, setUsernameIconHidden] = useState(true);

  const usernameRef = useRef();

  const clearUsernameInput = () => {
    setUsername("");
    usernameRef.current.clear();
    usernameRef.current.blur();
  };

  const handleUsernameOnChange = (username) => {
    setIsUsernameError(false);
    setUsername(username);
  };

  const handleUsernameOnFocus = () => {
    setUsernameIconHidden(false);
  };

  const handleUsernameEndEditing = () => {
    setUsernameIconHidden(true);
  };

  useEffect(() => {
    const getProfileInfo = onSnapshot(
      userRef,
      (doc) => {
        console.log("Document data:", doc.data());
        setUser(doc.data());
        setProfilePicURL(doc.data().profile_pic_url);
      },
      (error) => {},
      []
    );

    return () => {
      getProfileInfo();
    };
  }, [uid]);

  const onSubmitHandler = async () => {
    await updateDoc(userRef, {
      username: username,
    });
    clearUsernameInput();
  };

  return (
    <View style={styles.container}>
      <Header
        containerStyle={styles.header}
        backgroundColor={woo_white}
        leftComponent={
          <Icon
            name="chevron-left"
            type="font-awesome-5"
            color={woo_black}
            size={20}
            onPress={() => navigation.goBack()}
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
              edit profile
            </Text>
          </View>
        }
        leftContainerStyle={styles.leftComponent}
        centerContainerStyle={styles.centerComponent}
      />
      <ScrollView style={styles.bodyContainer}>
        <View style={styles.profilePicContainer}>
          <Text style={styles.profilePicText}>update profile picture:</Text>
          <Avatar
            rounded
            size="xlarge"
            onPress={() => navigation.navigate("Profile")}
            source={{ uri: profilePicURL }}
          />
        </View>
        <View style={styles.usernameContainer}>
          <Input
            label="update username"
            labelStyle={{ color: "black", marginBottom: 10 }}
            style={{}}
            ref={usernameRef}
            value={username}
            onChangeText={(text) => handleUsernameOnChange(text)}
            placeholder={`@${user && user.username}`}
            autoCapitalize="none"
            errorStyle={{ color: "red" }}
            errorMessage={isUsernameError && errorMessage}
            onFocus={() => handleUsernameOnFocus()}
            onEndEditing={() => handleUsernameEndEditing()}
            rightIcon={
              !isUsernameIconHidden && (
                <Icon
                  Icon
                  name="close"
                  size={18}
                  onPress={() => clearUsernameInput()}
                />
              )
            }
          />
          <TouchableOpacity
            style={styles.loginBtnStyle}
            onPress={onSubmitHandler}
          >
            <Text style={styles.loginBtnTextStyle}>update username</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
    marginBottom: 5,
  },
  leftComponent: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerComponent: {
    justifyContent: "center",
    alignItems: "center",
  },
  bodyContainer: {
    padding: 20,
  },
  profilePicContainer: {
    alignItems: "center",
  },
  profilePicText: {
    marginBottom: 5,
    fontWeight: "bold",
  },
  usernameContainer: {
    marginTop: 20,
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

export default EditProfileScreen;
