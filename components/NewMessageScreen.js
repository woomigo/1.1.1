import { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { woo_white } from "../assets/colors";
import { AuthContext } from "../context/AuthContext";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import Button from "./Button";
import SelectableUserListView from "./SelectableUserListView";
import { localhost } from "./utility";

const NewMessageScreen = ({ route, navigation }) => {
  const { user, token } = useContext(AuthContext);
  const { uid } = route.params;

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");

  const isGroupChat = selectedUsers.length > 1;

  const findExistingDirectChat = async (userId, otherUserId) => {
    const q = query(
      collection(db, "chats"),
      where("type", "==", "direct"),
      where("participants", "array-contains", userId)
    );

    const snapshot = await getDocs(q);

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      if (
        data.participants.length === 2 &&
        data.participants.includes(otherUserId)
      ) {
        return { id: docSnap.id, ...data };
      }
    }

    return null;
  };

  const handleCreateChat = async () => {
    if (selectedUsers.length === 0) return;

    const participantIds = [...selectedUsers.map((u) => u.uuid), user.id];

    try {
      if (!isGroupChat && selectedUsers.length === 1) {
        const existingChat = await findExistingDirectChat(
          user.id,
          selectedUsers[0].uuid
        );

        if (existingChat) {
          console.log("Existing chat found, navigating...");
          navigation.navigate("MessageDetails", {
            chatId: existingChat.id,
            newChat: existingChat,
            uid,
          });
          return;
        }
      }

      const unreadCounts = participantIds.reduce((acc, uid) => {
        acc[uid] = 0;
        return acc;
      }, {});

      const payload = {
        type: isGroupChat ? "group" : "direct",
        name: isGroupChat ? groupName || "New Group" : null,
        participants: participantIds,
        owner_id: user.id,
        created_at: serverTimestamp(),
        last_message: null,
        read_receipts: {},
        unread_counts: unreadCounts,
      };

      const chatRef = await addDoc(collection(db, "chats"), payload);

      navigation.navigate("MessageDetails", {
        chatId: chatRef.id,
        newChat: payload,
        uid: user.id,
      });
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: woo_white }}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={{ flex: 1, padding: 16 }}
        keyboardVerticalOffset={80}
      >
        <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 16 }}>
          {isGroupChat ? "New Group Chat" : "New Message"}
        </Text>

        {isGroupChat && (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 4 }}>
              Group Name
            </Text>
            <TextInput
              placeholder="Enter a group name"
              value={groupName}
              onChangeText={setGroupName}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 10,
                fontSize: 14,
                marginBottom: 5,
              }}
            />
          </View>
        )}

        <SelectableUserListView
          users={[]} // pass local users if you have them, e.g. followerProfiles
          searchEndpoint={`${localhost}/users/search?username=`}
          token={token}
          mode="remote-only"
          onChangeSelected={(users) => setSelectedUsers(users)}
        />

        <Button
          text={isGroupChat ? "Create Group" : "Start Chat"}
          onPress={handleCreateChat}
        />
      </KeyboardAvoidingView>
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
  name: { marginLeft: 10, fontSize: 16, fontWeight: "bold" },
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
