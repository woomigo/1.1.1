// import React, { useState, useEffect, useCallback, useContext } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   Alert,
//   StyleSheet,
//   ActivityIndicator,
// } from 'react-native';
// import axios from 'axios';
// import moment from 'moment';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import debounce from 'lodash.debounce';
// // import { AuthContext } from '../contexts/AuthContext';

// const MoreInfoScreen = ({ navigation }) => {
// //   const { user, token } = useContext(AuthContext);

//   const [username, setUsername] = useState('');
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [dob, setDob] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [checkingUsername, setCheckingUsername] = useState(false);
//   const [usernameAvailable, setUsernameAvailable] = useState(null);

//   const isAtLeast13 = (date) => {
//     const age = moment().diff(moment(date), 'years');
//     return age >= 13;
//   };

//   const checkUsername = async (name) => {
//     if (!name) return setUsernameAvailable(null);
//     setCheckingUsername(true);
//     try {
//       const res = await axios.get(
//         `http://your-api-url.com/users/check-username?username=${name}`
//       );
//       setUsernameAvailable(res.data.available);
//     } catch (err) {
//       console.error(err);
//       setUsernameAvailable(null);
//     } finally {
//       setCheckingUsername(false);
//     }
//   };

//   const debouncedCheckUsername = useCallback(debounce(checkUsername, 500), []);

//   useEffect(() => {
//     debouncedCheckUsername(username);
//   }, [username]);

//   const handleSubmit = async () => {
//     if (!username || !firstName || !lastName || !dob) {
//       return Alert.alert('Validation Error', 'All fields are required.');
//     }

//     if (!isAtLeast13(dob)) {
//       return Alert.alert('Validation Error', 'You must be at least 13 years old.');
//     }

//     if (usernameAvailable === false) {
//       return Alert.alert('Username Taken', 'Please choose another username.');
//     }

//     setLoading(true);

//     try {
//       await axios.put(
//         `http://your-api-url.com/users/${user.id}`,
//         {
//           username,
//           first_name: firstName,
//           last_name: lastName,
//           dob: moment(dob).format('YYYY-MM-DD'),
//           is_profile_complete: true,
//           profile_pic_url: profilePic || null,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       navigation.replace('Home');
//     } catch (err) {
//       console.error(err);
//       Alert.alert('Error', 'Failed to update profile.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         placeholder="Username"
//         value={username}
//         onChangeText={setUsername}
//         autoCapitalize="none"
//         style={styles.input}
//       />
//       {checkingUsername && <ActivityIndicator />}
//       {!checkingUsername && username.length > 0 && usernameAvailable === true && (
//         <Text style={styles.available}>✅ Username is available</Text>
//       )}
//       {!checkingUsername && username.length > 0 && usernameAvailable === false && (
//         <Text style={styles.unavailable}>❌ Username is taken</Text>
//       )}

//       <TextInput
//         placeholder="First Name"
//         value={firstName}
//         onChangeText={setFirstName}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Last Name"
//         value={lastName}
//         onChangeText={setLastName}
//         style={styles.input}
//       />
//       {/* <Button title="Pick Date of Birth" onPress={() => setShowDatePicker(true)} /> */}
//       {/* {showDatePicker && ( */}
//         <DateTimePicker
//           value={dob}
//           mode="date"
//           display="default"
//           maximumDate={new Date()}
//           onChange={(event, selectedDate) => {
//             // setShowDatePicker(false);
//             if (selectedDate) setDob(selectedDate);
//           }}
//         />
//       {/* )} */}
//       <Text style={styles.dobText}>DOB: {moment(dob).format('MMMM D, YYYY')}</Text>

//       <Button title={loading ? 'Saving...' : 'Submit'} onPress={handleSubmit} disabled={loading} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20 },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 12,
//     marginBottom: 10,
//     borderRadius: 5,
//   },
//   dobText: {
//     textAlign: 'center',
//     marginVertical: 10,
//     fontSize: 16,
//   },
//   available: {
//     color: 'green',
//     marginBottom: 10,
//   },
//   unavailable: {
//     color: 'red',
//     marginBottom: 10,
//   },
// });

// export default MoreInfoScreen;

import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import moment from "moment";
import debounce from "lodash.debounce";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Avatar from "./Avatar";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uuid from "react-native-uuid";
import { storage } from "../firebaseConfig";
import { AuthContext } from "../context/AuthContext";

const MoreInfoScreen = ({ navigation, route }) => {
  const { user, token, updateUser } = useContext(AuthContext);

  const localhost = "http://10.0.0.250:3000";

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState(new Date());
  const [profilePicture, setProfilePicture] = useState(null);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLowercaseValid, setIsLowercaseValid] = useState(false);
  const [isLengthValid, setIsLengthValid] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const isAtLeast13 = (date) => {
    const age = moment().diff(moment(date), "years");
    return age >= 13;
  };

  const validateUsernameLocally = (value) => {
    const isLower = value.length > 0 && value === value.toLowerCase();
    const isLengthOk = value.length >= 3 && value.length <= 15;

    setIsLowercaseValid(isLower);
    setIsLengthValid(isLengthOk);

    if (isLower && isLengthOk) {
      debouncedCheckAvailability(value);
    } else {
      setIsAvailable(false); // Don't check if invalid locally
    }
  };

  const debouncedCheckAvailability = debounce(async (value) => {
    setCheckingAvailability(true);
    try {
      const response = await axios.get(
        `${localhost}/users/check-username?username=${value}`
      );
      setIsAvailable(response.data.available);
    } catch (err) {
      console.error(err);
      setIsAvailable(false);
    } finally {
      setCheckingAvailability(false);
    }
  }, 500);

  useEffect(() => {
    // console.log(`USER is ${JSON.stringify(user)}`);
    const checkLoginStatus = async () => {
      const asToken = await AsyncStorage.getItem("token");
      if (!token || !asToken) {
        navigation.navigate("Login"); // If no token, redirect to login
      }
    };

    const getUserId = async () => {
      const asToken = await AsyncStorage.getItem("token");
      if (token || asToken) {
        try {
          const response = await fetch(`${localhost}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (response.ok) {
            // Save ID and other info to local state or context
            setUserId(data.id);
          } else {
            // handle error
          }
        } catch (err) {
          console.error(`ERROR ${err}`);
        }
      } else {
        console.log("Actually HERE");
      }

      // setLoading(false);
    };

    checkLoginStatus();
    getUserId();
  }, [navigation, username]);

  const handleSave = async () => {
    const token = await AsyncStorage.getItem("token");

    if (!username || !firstName || !lastName || !dob) {
      return Alert.alert("Validation Error", "All fields are required.");
    }

    if (!isAtLeast13(dob)) {
      return Alert.alert(
        "Validation Error",
        "You must be at least 13 years old."
      );
    }

    setLoading(true);

    let profilePicUrl = null;
    if (profilePicture) {
      try {
        profilePicUrl = await uploadImageAsync(profilePicture);
      } catch (error) {
        console.error("Upload error:", error);
        Alert.alert("Upload Error", "Could not upload profile picture.");
        setLoading(false);
        return;
      }
    }

    if (!token) {
      Alert.alert("Error", "You must be logged in to update your info.");
      return;
    }
    console.log("token:", token);
    console.log("userId:", userId);
    console.log("Sending data to server:", {
      username,
      first_name: firstName,
      last_name: lastName,
      dob: moment(dob).format("YYYY-MM-DD"),
      is_profile_complete: true,
      profile_pic_url: profilePicUrl || null,
    });

    try {
      const res = await fetch(`${localhost}/users/complete-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          first_name: firstName,
          last_name: lastName,
          dob: moment(dob).format("YYYY-MM-DD"),
          is_profile_complete: true,
          profile_pic_url: profilePicUrl || null,
        }),
      });

      let data;

      try {
        data = await res.json(); // Read and parse once
        console.log("Parsed response:", data);
      } catch (err) {
        console.error("Failed to parse JSON (maybe HTML error):", err);
        const text = await res.text(); // fallback for debugging
        console.error("Raw response:", text);
        throw new Error("Invalid server response");
      }

      if (res.ok) {
        Alert.alert("Success", "Your information has been updated.");
        updateUser(data);
        navigation.reset({
          index: 0,
          routes: [{ name: "HomeTab" }],
        });
      } else {
        Alert.alert("Error", data.error || "Failed to update information.");
      }
    } catch (error) {
      console.error("ERROR:", error.message || error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const uploadImageAsync = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = `profile_pics/${uuid.v4()}.jpg`;
    const imageRef = ref(storage, filename);
    await uploadBytes(imageRef, blob);
    return await getDownloadURL(imageRef);
  };

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem("token");
    console.log(`ID from user is ${user.uuid}`);
    console.log(`ID from userID is ${userId}`);
    if (!username || !firstName || !lastName || !dob) {
      return Alert.alert("Validation Error", "All fields are required.");
    }

    if (!isAtLeast13(dob)) {
      return Alert.alert(
        "Validation Error",
        "You must be at least 13 years old."
      );
    }

    // if (!isLowercaseValid || !isLengthValid || !isAvailable) {
    //   return Alert.alert("Validation Error", "Please fix the username.");
    // }

    setLoading(true);

    let profilePicUrl = null;
    if (profilePicture) {
      try {
        profilePicUrl = await uploadImageAsync(profilePicture);
      } catch (error) {
        console.error("Upload error:", error);
        Alert.alert("Upload Error", "Could not upload profile picture.");
        setLoading(false);
        return;
      }
    }

    try {
      await axios.put(
        `${localhost}/users/${user.id}`,
        {
          username,
          first_name: firstName,
          last_name: lastName,
          dob: moment(dob).format("YYYY-MM-DD"),
          is_profile_complete: true,
          profile_pic_url: profilePicUrl || null,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigation.replace("Home");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    console.log("IMAGE CLICKED");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.header}>complete your profile</Text>

      {/* Profile Picture */}
      <Text style={styles.dobText}>select your profile picture:</Text>
      <TouchableOpacity
        style={styles.profilePictureContainer}
        onPress={pickImage}
      >
        {profilePicture ? (
          <Avatar size={100} image={profilePicture} onPress={pickImage} />
        ) : (
          //   <Image
          //     source={{ uri: profilePicture }}
          //     style={styles.profilePicture}
          //   />
          <Avatar
            onPress={pickImage}
            size={100}
            fontSize={22}
            // placeholder={"profile picture"}
            name={
              firstName.length &&
              lastName.length > 0 &&
              `${firstName} ${lastName}`
            }
          />
        )}
      </TouchableOpacity>

      {/* Username */}
      <Text style={styles.label}>
        username <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="choose your username"
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          validateUsernameLocally(text);
        }}
      />

      <View style={{ marginBottom: 15 }}>
        <Text style={isLowercaseValid ? styles.valid : styles.invalid}>
          {isLowercaseValid ? "✅" : "❌"} must be all lowercase
        </Text>
        <Text style={isLengthValid ? styles.valid : styles.invalid}>
          {isLengthValid ? "✅" : "❌"} 3–15 characters
        </Text>
        <Text style={isAvailable ? styles.valid : styles.invalid}>
          {checkingAvailability ? "⏳" : isAvailable ? "✅" : "❌"} username
          available
        </Text>
      </View>

      {/* First Name */}
      <Text style={styles.label}>
        first name <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="enter your first name"
        value={firstName}
        onChangeText={setFirstName}
      />

      {/* Last Name */}
      <Text style={styles.label}>
        last name <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="enter your last name"
        value={lastName}
        onChangeText={setLastName}
      />

      {/* Date of Birth */}
      <Text style={styles.dobText}>
        select your date of birth:<Text style={styles.required}>*</Text>
      </Text>

      {/* <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}> */}
      <DateTimePicker
        value={dob}
        mode="date"
        display="default"
        maximumDate={new Date()}
        onChange={(event, selectedDate) => {
          // setShowDatePicker(false);
          if (selectedDate) setDob(selectedDate);
        }}
      />
      {/* </View> */}

      {/* Submit Button */}
      <View style={{ marginVertical: 50 }}>
        <Button
          title={loading ? "saving..." : "submit"}
          onPress={handleSave}
          disabled={loading}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  profilePictureContainer: {
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profilePictureText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  label: { fontSize: 16, marginBottom: 5 },
  required: { color: "red" },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  dobText: {
    // textAlign: "center",
    marginVertical: 10,
    fontSize: 16,
  },
  valid: {
    color: "green",
    marginBottom: 5,
  },
  invalid: {
    color: "gray",
    marginBottom: 5,
  },
  cancelButton: {
    marginTop: 20,
    alignItems: "center",
  },
  cancelText: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MoreInfoScreen;
