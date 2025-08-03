import React, { useState, useEffect, useCallback } from "react";
("@rneui/themed");
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Button,
} from "react-native";
import ListViewWoos from "./ListViewWoos";
import { woo_black, woo_white, woo_orange } from "../assets/colors";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome6";
import ListViewStories from "./ListViewStories";
import ListViewPrivateWoos from "./ListViewPrivateWoos";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const HomeScreen = ({ route, navigation }) => {
  const { user, token } = route.params;

  const localhost = "http://192.168.12.240:3000";

  const [publicWoos, setPublicWoos] = useState([]);
  const [privateWoos, setPrivateWoos] = useState([]);
  const [storyFeed, setStoryFeed] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPrivateVisible, setIsPrivateVisible] = useState(false);

  // const createUser = async () => {
  //   try {
  //     const response = await fetch(`${localhost}/users/`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         name: "Joe Doe",
  //         email: "joe@example.com",
  //         password: "secret",
  //       }),
  //     });

  //     const data = await response.json();
  //     Alert.alert("Response", JSON.stringify(data));
  //   } catch (error) {
  //     console.error("Error:", error);
  //     Alert.alert("Error", error.message);
  //   }
  // };

  // const fetchUsers = async () => {
  //   try {
  //     const response = await fetch(`${localhost}/users/`);
  //     const data = await response.json();
  //     console.log(JSON.stringify(data));
  //     setUsers(data);
  //   } catch (error) {
  //     console.error("Fetch error:", error);
  //   }
  // };

  // const getUser = async (id) => {
  //   try {
  //     const response = await fetch(`${localhost}/users/${id}`);
  //     const data = await response.json();
  //     Alert.alert("User Details", JSON.stringify(data, null, 2));
  //   } catch (error) {
  //     console.error("Get user error:", error);
  //   }
  // };

  // const deleteUser = async (id) => {
  //   try {
  //     await fetch(`${localhost}/users/${id}`, {
  //       method: "DELETE",
  //     });
  //     Alert.alert("Deleted", `User with ID ${id} was deleted`);
  //     fetchUsers(); // Refresh the list
  //   } catch (error) {
  //     console.error("Delete error:", error);
  //   }
  // };

  // const startEditing = (user) => {
  //   setEditingUser(user.id);
  //   setForm({ name: user.name, email: user.email, password: user.password });
  // };

  // const updateUser = async () => {
  //   try {
  //     await fetch(`${localhost}/users/${editingUser}`, {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(form),
  //     });
  //     Alert.alert('Updated', `User with ID ${editingUser} was updated`);
  //     setEditingUser(null);
  //     setForm({ name: '', email: '', password: '' });
  //     fetchUsers();
  //   } catch (error) {
  //     console.error('Update error:', error);
  //   }
  // };

  async function fetchPublicFeed() {
    try {
      const response = await fetch(`${localhost}/woos/publicfeed`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch feed");

      const data = await response.json();
      setPublicWoos(data);
    } catch (err) {
      console.error("Error fetching feed:", err);
    }
  }

  async function fetchPrivateFeed() {
    try {
      const response = await fetch(`${localhost}/woos/privatefeed`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch feed");

      const data = await response.json();
      setPrivateWoos(data);
      // console.log("private woos " + JSON.stringify(data)); // Array of woos
      // Count unseen
      const unseenCount = data.reduce(
        (count, story) => count + (story.seen === 0 ? 1 : 0),
        0
      );

      setUnseenCount(unseenCount); // This could be state for a badge or something
    } catch (err) {
      console.error("Error fetching feed:", err);
    }
    return data;
  }

  const fetchStoryFeed = async () => {
    try {
      const response = await fetch(`${localhost}/stories/feed`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch story feed");

      const data = await response.json();
      setStoryFeed(data);
    } catch (error) {
      console.error("Error fetching story feed:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPrivateFeed();
      fetchPublicFeed();
      fetchStoryFeed();
    }, [token])
  );

  const togglePrivateVisible = () => {
    setIsPrivateVisible(!isPrivateVisible);
  };

  const logoutUser = async () => {
    // Remove the token from AsyncStorage
    await AsyncStorage.removeItem("token");
    // navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <Button title="Logout" onPress={logoutUser} /> */}
      <Text
        style={{
          textAlign: "center",
          fontWeight: "bold",
          color: woo_orange,
          fontSize: 22,
          margin: 10,
        }}
      >
        woomigo
      </Text>
      <ScrollView>
        <View
          style={{
            marginTop: 5,
          }}
        >
          <ListViewStories gallery={storyFeed} />
        </View>
        {/* <View style={styles.testContainer}>
      <Button title="Refresh Users" onPress={fetchUsers} />
      
      {editingUser && (
        <View style={styles.form}>
          <Text style={styles.editTitle}>Editing User ID {editingUser}</Text>
          <TextInput
            placeholder="Name"
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={form.password}
            secureTextEntry
            onChangeText={(text) => setForm({ ...form, password: text })}
            style={styles.input}
          />
          <Button title="Save" onPress={updateUser} />
        </View>
      )}

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>{item.email}</Text>
            <View style={styles.buttons}>
              <Button title="Edit" onPress={() => startEditing(item)} />
              <Button title="Delete" color="red" onPress={() => deleteUser(item.id)} />
            </View>
          </View>
        )}
      />
    </View> */}
        <View
          style={{
            flexDirection: "row",
            margin: 10,
            marginTop: 10,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              private woos
            </Text>
            {isPrivateVisible ? (
              <FontAwesomeIcon
                name="eye-slash"
                size={20}
                color={woo_black}
                onPress={() => setIsPrivateVisible(!isPrivateVisible)}
              />
            ) : (
              <FontAwesomeIcon
                name="eye"
                size={20}
                color={woo_black}
                onPress={() => setIsPrivateVisible(!isPrivateVisible)}
              />
            )}
            <Text style={styles.text}>{unseenCount}</Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            {/* <Text style={styles.smallText}>view all</Text> */}
          </View>
        </View>
        <ListViewPrivateWoos
          gallery={privateWoos}
          isVisible={isPrivateVisible}
          uid={user.uid}
        />
        <View
          style={{
            flexDirection: "row",
            margin: 10,
            marginTop: 10,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              public woos
            </Text>
          </View>
          {/* <Text style={styles.smallText}>view all</Text> */}
        </View>
        <ListViewWoos view={"list"} woos={publicWoos} uid={user.uid} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: woo_white,
  },
  testContainer: {
    flex: 1,
    padding: 20,
    marginTop: 40,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: woo_orange,
  },
  smallText: {
    fontSize: 12,
    fontWeight: "bold",
    color: woo_orange,
  },
  userCard: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: { fontWeight: "bold", fontSize: 16 },
});

export default HomeScreen;
