import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";

const RegisterScreen = ({ navigation }) => {
  const localhost = "http://192.168.12.240:3000";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      // Call the backend API to register
      const response = await fetch(`${localhost}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, isProfileComplete: false }),
      });

      const data = await response.json();

      console.log(`DATA TOKEN === ${JSON.stringify(data)}`);

      if (data.token) {
        // Save the token in AsyncStorage
        await AsyncStorage.setItem("token", data.token);

        // Navigate to the MoreInfoScreen
        navigation.navigate("MoreInfo");
      } else {
        // Handle registration errors
        Alert.alert("Error", data.error || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />

      <View style={styles.button}>
        <Button title="Register" onPress={handleRegister} />
      </View>

      <Text
        style={styles.loginLink}
        onPress={() => navigation.navigate("Login")}
      >
        Already have an account? Log in
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    height: 48,
    backgroundColor: "#fff",
    marginBottom: 15,
    borderRadius: 8,
    paddingHorizontal: 15,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  button: {
    marginTop: 10,
    marginBottom: 20,
  },
  loginLink: {
    textAlign: "center",
    color: "#007BFF",
    textDecorationLine: "underline",
  },
});

export default RegisterScreen;
