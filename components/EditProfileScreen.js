import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Header, Icon, Input } from "@rneui/themed";
import { woo_black, woo_white } from "../assets/colors";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Avatar from "./Avatar";
import Button from "./Button";

const EditProfileScreen = ({ route, navigation }) => {
  const { user, uid } = route.params;

  // const userRef = doc(db, "users", uid);

  // const [user, setUser] = useState();
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
    // const getProfileInfo = onSnapshot(
    //   userRef,
    //   (doc) => {
    //     console.log("Document data:", doc.data());
    //     setUser(doc.data());
    //     setProfilePicURL(doc.data().profile_pic_url);
    //   },
    //   (error) => {},
    //   []
    // );

    // return () => {
    //   getProfileInfo();
    // };
    console.log("user is: ", user);
  }, [uid]);

  const onSubmitHandler = async () => {
    console.log("UPDATE PROFILE")
    // await updateDoc(userRef, {
    //   username: username,
    // });
    // clearUsernameInput();
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
            size={120}
            name={user.first_name + " " + user.last_name}
            onPress={() => navigation.navigate("Profile")}
            image={user.profile_pic_url}
          />
        </View>
        <View style={styles.inputContainer}>
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
        </View>
        <View style={styles.inputContainer}>
          <Input
            label="update first name"
            labelStyle={{ color: "black", marginBottom: 10 }}
            style={{}}
            ref={usernameRef}
            value={username}
            onChangeText={(text) => handleUsernameOnChange(text)}
            placeholder={`${user && user.first_name}`}
            autoCapitalize="none"
            errorStyle={{ color: "red" }}
            // errorMessage={isUsernameError && errorMessage}
            // onFocus={() => handleUsernameOnFocus()}
            // onEndEditing={() => handleUsernameEndEditing()}
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
        </View>
        <View style={styles.inputContainer}>
          <Input
            label="update last name"
            labelStyle={{ color: "black", marginBottom: 10 }}
            style={{}}
            ref={usernameRef}
            value={username}
            onChangeText={(text) => handleUsernameOnChange(text)}
            placeholder={`${user && user.last_name}`}
            autoCapitalize="none"
            errorStyle={{ color: "red" }}
            // errorMessage={isUsernameError && errorMessage}
            // onFocus={() => handleUsernameOnFocus()}
            // onEndEditing={() => handleUsernameEndEditing()}
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
        </View>
      </ScrollView>
<Button text={"update profile"} onPress={onSubmitHandler} />
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
  inputContainer: {
    marginTop: 20,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 5, // Distance from the bottom of the screen
    left: 16,
    right: 16, // Optional: keep it aligned to left and right edges
    marginBottom: 5, // Adds space from bottom of the screen
  },
  createChatButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  createChatText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditProfileScreen;
