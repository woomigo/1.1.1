import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
  SafeAreaView,
} from "react-native";
// import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "../components/Avatar"; // Your avatar component
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import { woo_black, woo_white } from "../assets/colors";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  getDoc,
  query,
  where,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

const dummyUsers = [
  { id: "u1", name: "Samantha Green" },
  { id: "u2", name: "Liam Anderson" },
  { id: "u3", name: "Olivia Chen" },
  { id: "u4", name: "Noah Rodriguez" },
  { id: "u5", name: "Ava Patel" },
  { id: "u6", name: "Ethan Lee" },
  { id: "u7", name: "Isabella Martinez" },
  { id: "u8", name: "Mason Kim" },
  { id: "u9", name: "Sophia Nguyen" },
  { id: "u10", name: "James Thompson" },
  { id: "u11", name: "Harper Wright" },
  { id: "u12", name: "Benjamin Scott" },
  { id: "u13", name: "Chloe Davis" },
  { id: "u14", name: "Jackson Hall" },
  { id: "u15", name: "Amelia Young" },
];

const NewMessageScreen = ({ route, navigation }) => {
  //   const navigation = useNavigation();

  const { uid } = route.params;

  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [followerProfiles, setFollowerProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const isGroupChat = selectedUsers.length > 1;

const listenToFollowers = (onUpdate) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.warn('No authenticated user found.');
        onUpdate([]);
        return () => {};
      }
  
      const userRef = doc(db, 'users', user.uid);
  
      const unsubscribe = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const followers = data.followers || [];
  
          console.log('🔄 Fetched live followers:', followers);
          onUpdate(followers);
        } else {
          console.warn('User document does not exist.');
          onUpdate([]);
        }
      }, (error) => {
        console.error('❌ Error listening to followers:', error);
        onUpdate([]);
      });
  
      return unsubscribe;
    } catch (error) {
      console.error('❌ Exception in listenToFollowers:', error);
      return () => {};
    }
  };

  const listenToUserProfiles = (userIds, onUpdate) => {
    const unsubscribers = [];
    const profiles = {};
  
    try {
      userIds.forEach((uid) => {
        const userRef = doc(db, 'users', uid);
  
        const unsubscribe = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            profiles[uid] = {
              id: uid,
              name: data.first_name + " " + data.last_name || '',
              profilePicUrl: data.profile_pic_url || '',
            };
  
            const result = Object.values(profiles);
            console.log(`👤 Updated profiles (${result.length}):`, result);
            onUpdate(result);
          } else {
            console.warn(`Follower user document not found: ${uid}`);
          }
        }, (error) => {
          console.error(`❌ Error listening to user profile ${uid}:`, error);
        });
  
        unsubscribers.push(unsubscribe);
      });
    } catch (error) {
      console.error('❌ Exception in listenToUserProfiles:', error);
    }
  
    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  };

  useEffect(() => {
    let unsubscribeProfiles = null;

    const unsubscribeFollowers = listenToFollowers((followerUids) => {
      if (unsubscribeProfiles) unsubscribeProfiles();

      if (followerUids.length > 0) {
        unsubscribeProfiles = listenToUserProfiles(followerUids, (profiles) => {
          setFollowerProfiles(profiles);
          setLoading(false);
        });
      } else {
        setFollowerProfiles([]);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeFollowers();
      if (unsubscribeProfiles) unsubscribeProfiles();
    };
  }, []);

  const filteredUsers =
    followerProfiles.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) &&
        !selectedUsers.some((u) => u.id === user.id)
    );

  const toggleUserSelect = (user) => {
    setSelectedUsers((prev) =>
      prev.find((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user]
    );
  };

  const handleRemoveUser = (id) => {
    const updated = selectedUsers.filter((u) => u.id !== id);
    setSelectedUsers(updated);
    if (updated.length === 0) setShowAllUsers(false);
  };

  const handleCreateChat = async () => {
    if (selectedUsers.length === 0) return;

    const payload = {
      type: isGroupChat ? "group" : "direct",
      name: isGroupChat ? groupName || "New Group" : null,
      participants: [...selectedUsers.map((u) => u.id), uid],
      owner_id: uid,
      created_at: serverTimestamp(),
      last_message: null,
      read_receipts: {},
    };

    try {
      const chatRef = await addDoc(collection(db, "chats"), payload);
      console.log("Chat created with ID:", chatRef.id);

      navigation.navigate("MessageDetails", {
        chatId: chatRef.id,
        chat: payload,
      });
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

//   const handleCreateChat = async ({ userIds, isGroup, currentUser }) => {
//     if (!currentUser || !userIds || userIds.length === 0) return;
  
//     const participants = [...userIds, currentUser.uid];
//     const readReceipts = {};
  
//     participants.forEach((uid) => {
//       readReceipts[uid] = null; // Initially no one has read anything
//     });
  
//     const chatPayload = {
//       participants,
//       is_group: isGroup,
//       owner_id: currentUser.uid,
//       created_at: serverTimestamp(),
//       last_message: null,
//       read_receipts: readReceipts,
//     };
  
//     try {
//       const chatRef = await addDoc(collection(db, 'chats'), chatPayload);
//       console.log('✅ Chat created with ID:', chatRef.id);
//       navigation.navigate("MessageDetails", {
//         chatId: chatRef.id,
//         chat: chatPayload,
//       });
//     } catch (error) {
//       console.error('❌ Failed to create chat:', error);
//       throw error;
//     }
//   };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: woo_white }}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={styles.container}
        keyboardVerticalOffset={80}
      >
        <Text style={styles.screenTitle}>
          {isGroupChat ? "New Group Chat" : "New Message"}
        </Text>

        <View style={styles.header}>
          <View
            style={{
              //   backgroundColor: "blue",
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Pressable onPress={() => navigation.goBack()}>
              <FontAwesome6Icon
                name="chevron-left"
                size={24}
                color={woo_black}
                style={{ marginEnd: 10 }}
              />
            </Pressable>
            {/* Selected users */}
            <View style={styles.avatarRow}>
              {selectedUsers.slice(0, 5).map((user, index) => (
                <View
                  key={user.id}
                  style={[styles.avatarWrapper, index !== 0 && styles.overlap]}
                >
                  <Avatar name={user.name} image={user.profilePicUrl} size={36} />
                </View>
              ))}

              {selectedUsers.length > 5 && (
                <View style={[styles.avatarWrapper, styles.overlap]}>
                  <View style={styles.extraAvatar}>
                    <Text style={styles.extraText}>
                      +{selectedUsers.length - 5}
                    </Text>
                  </View>
                </View>
              )}

              {selectedUsers.length > 0 && (
                <TouchableOpacity
                  onPress={() => setShowAllUsers(true)}
                  style={styles.managePill}
                >
                  <Ionicons name="people-outline" size={14} color="#007BFF" />
                  <Text style={styles.manageText}>Manage</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {isGroupChat && (
          <View style={styles.groupNameContainer}>
            <Text style={styles.label}>Group Name</Text>
            <TextInput
              placeholder="Enter a group name"
              value={groupName}
              onChangeText={setGroupName}
              style={styles.input}
            />
          </View>
        )}

        <TextInput
          placeholder="Search users..."
          style={styles.input}
          value={search}
          onChangeText={setSearch}
        />

        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.userItem}
              onPress={() => toggleUserSelect(item)}
            >
              <Avatar name={item.name} image={item.profilePicUrl} size={36} />
              <Text style={styles.userName}>{item.name}</Text>
              <Ionicons
                name="add-circle-outline"
                size={20}
                color="#007BFF"
                style={{ marginLeft: "auto" }}
              />
            </TouchableOpacity>
          )}
          //   style={{ maxHeight: 150 }}
        />

        {/* Initial message input
        <TextInput
          placeholder="Write your first message..."
          value={message}
          onChangeText={setMessage}
          style={styles.messageInput}
          multiline
        /> */}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.createChatButton}
            onPress={handleCreateChat} // Function to create chat/group
          >
            <Text style={styles.createChatText}>
              {isGroupChat ? "Create Group" : "Start Chat"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={showAllUsers}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAllUsers(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>manage participants</Text>
            <FlatList
              data={selectedUsers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.modalUserRow}>
                  <Avatar name={item.name} image={item.profilePicUrl} size={36} />
                  <Text style={{ marginLeft: 10, flex: 1 }}>{item.name}</Text>
                  <TouchableOpacity onPress={() => handleRemoveUser(item.id)}>
                    <Ionicons name="remove-circle" size={22} color="#FF4C4C" />
                  </TouchableOpacity>
                </View>
              )}
            />
            <TouchableOpacity
              onPress={() => setShowAllUsers(false)}
              style={styles.modalClose}
            >
              <Text style={{ color: "#007BFF", fontWeight: "600" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  label: { fontSize: 14, marginStart: 10, marginBottom: 10, fontWeight: "600" },
  input: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  header: {
    padding: 5,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    // backgroundColor: "blue",
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  userName: { marginLeft: 10, fontSize: 16 },
  selectedUsers: {
    flexDirection: "row",
    paddingVertical: 10,
    marginBottom: 10,
  },
  selectedUser: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    padding: 6,
    backgroundColor: "#e6f2ff",
    borderRadius: 20,
  },
  selectedUserName: {
    marginLeft: 6,
    marginRight: 4,
  },
  messageInput: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 10,
  },
  container: {
    flex: 1,
    justifyContent: "space-between", // Ensure content is spread out
    padding: 16,
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
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: 'red'
  },
  avatarWrapper: {
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 36,
  },
  overlap: {
    marginLeft: -20,
  },
  extraAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  extraText: {
    fontWeight: "600",
    color: "#333",
    fontSize: 12,
  },

  managePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6f0ff",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 8,
  },
  manageText: {
    color: "#007BFF",
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "500",
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    maxHeight: "70%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  modalUserRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  modalClose: {
    marginTop: 16,
    alignSelf: "center",
  },
  groupNameContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 5,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
});

export default NewMessageScreen;
