import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  Alert,
  StyleSheet,
  Button,
  TextInput,
} from "react-native";
import { doc, getDoc, updateDoc, arrayRemove, getDocs, collection, arrayUnion } from "firebase/firestore";
import Avatar from "../components/Avatar";
import { db, auth } from "../firebaseConfig";

const ManageParticipantsScreen = ({ route, navigation }) => {
  const { chatId } = route.params;
  const currentUser = auth.currentUser;
  const [participants, setParticipants] = useState([]);
  const [selectedToRemove, setSelectedToRemove] = useState([]);
  const [ownerId, setOwnerId] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedToAdd, setSelectedToAdd] = useState([]);

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const chatDoc = await getDoc(doc(db, "chats", chatId));
        if (!chatDoc.exists()) return;

        const chat = chatDoc.data();
        setOwnerId(chat.owner_id);

        const userDocs = await Promise.all(
          chat.participants.map((uid) => getDoc(doc(db, "users", uid)))
        );

        const users = userDocs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        }));

        setParticipants(users);
      } catch (err) {
        console.error("Failed to load participants:", err.message);
      }
    };

    fetchChatData();
  }, [chatId]);

  const toggleSelect = (uid) => {
    if (uid === currentUser.uid) return; // Don't allow removing self

    setSelectedToRemove((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    );
  };

  const searchUsers = async (query) => {
    if (!query) return;
    try {
      const q = query.toLowerCase();
      const snapshot = await getDocs(collection(db, "users"));
      const results = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const isAlreadyInChat = participants.some((p) => p.uid === docSnap.id);
        const matches = `${data.first_name} ${data.last_name}`
          .toLowerCase()
          .includes(q);

        if (!isAlreadyInChat && matches) {
          results.push({ uid: docSnap.id, ...data });
        }
      });

      setSearchResults(results);
    } catch (err) {
      console.error("Error searching users:", err.message);
    }
  };

  const addParticipantsToChat = async (chatId, newUserIds) => {
    try {
      const chatRef = doc(db, "chats", chatId);
      await updateDoc(chatRef, {
        participants: arrayUnion(...newUserIds),
      });
      console.log("Participants added successfully");
    } catch (err) {
      console.error("Error adding participants:", err.message);
    }
  };

  const handleAddParticipants = async () => {
    if (selectedToAdd.length === 0) return;

    try {
      const userIds = selectedToAdd.map((u) => u.uid);
      await addParticipantsToChat(chatId, userIds);
      setSelectedToAdd([]);
      setSearchResults([]);
      Alert.alert("Success", "Participants added!");
      navigation.goBack()
    } catch (err) {
      console.error("Add failed:", err.message);
    }
  };

  const confirmRemoval = () => {
    if (selectedToRemove.length === 0) return;

    Alert.alert(
      "Remove Participants",
      `Are you sure you want to remove ${selectedToRemove.length} participant(s)?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              const chatRef = doc(db, "chats", chatId);
              const updates = selectedToRemove.map((uid) =>
                updateDoc(chatRef, {
                  participants: arrayRemove(uid),
                })
              );
              await Promise.all(updates);
              navigation.goBack();
            } catch (err) {
              console.error("Failed to remove users:", err.message);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Participants</Text>

      <FlatList
        data={participants}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => toggleSelect(item.uid)}
            style={[
              styles.row,
              selectedToRemove.includes(item.uid) && styles.selectedRow,
            ]}
          >
            <Avatar uri={item.profile_picture_url} />
            <Text style={styles.name}>
              {item.first_name} {item.last_name}
              {item.uid === ownerId ? " (Owner)" : ""}
            </Text>
          </Pressable>
        )}
      />

      {selectedToRemove.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.selectedText}>
            Selected: {selectedToRemove.length}
          </Text>
          <Button
            title="Remove Selected"
            onPress={confirmRemoval}
            color="red"
          />
        </View>
      )}

      <TextInput
        placeholder="Search for users to add..."
        onChangeText={searchUsers}
        style={styles.searchInput}
      />

      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              const alreadySelected = selectedToAdd.find(
                (u) => u.uid === item.uid
              );
              setSelectedToAdd((prev) =>
                alreadySelected
                  ? prev.filter((u) => u.uid !== item.uid)
                  : [...prev, item]
              );
            }}
            style={styles.searchResultRow}
          >
            <Avatar uri={item.profile_picture_url} />
            <Text>
              {item.first_name} {item.last_name}
            </Text>
          </Pressable>
        )}
      />

      {selectedToAdd.length > 0 && (
        <Button
          title={`Add ${selectedToAdd.length} user(s)`}
          onPress={handleAddParticipants}
        />
      )}
    </View>
  );
};

export default ManageParticipantsScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      paddingTop: 40,
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 22,
      fontWeight: '600',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '500',
      marginTop: 24,
      marginBottom: 8,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      backgroundColor: '#f9f9f9',
      borderRadius: 8,
      marginBottom: 8,
    },
    selectedRow: {
      backgroundColor: '#e0f0ff',
    },
    name: {
      marginLeft: 12,
      fontSize: 16,
    },
    footer: {
      paddingVertical: 12,
      borderTopWidth: 1,
      borderColor: '#ccc',
      marginTop: 8,
    },
    selectedText: {
      fontSize: 16,
      marginBottom: 8,
    },
    searchInput: {
      backgroundColor: '#f1f1f1',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 16,
      marginBottom: 12,
    },
    searchResultRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      backgroundColor: '#fefefe',
      borderRadius: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: '#e6e6e6',
    },
  });
  
