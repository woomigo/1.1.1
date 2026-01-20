import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import { woo_black, woo_gray, woo_orange, woo_white } from "../assets/colors";
import { Swipeable } from "react-native-gesture-handler";
import Avatar from "./Avatar";
import {
  collection,
  doc,
  getDoc,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { AuthContext } from "../context/AuthContext";
import { localhost } from "./utility";

const MessageDetailsScreen = ({ route, navigation }) => {
  const { chatId, newChat, uid } = route.params;
  const { token, user } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chat, setChat] = useState();
  const [participantProfiles, setParticipantProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const markChatAsRead = async (chatId) => {
    try {
      const currentUser = user;
      if (!uid) throw new Error("User not authenticated");

      const chatRef = doc(db, "chats", chatId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        console.warn("Chat not found");
        return;
      }

      const chatData = chatSnap.data();
      const userLastRead = chatData.read_receipts?.[currentUser.id];
      const lastMessageTime = chatData.last_message?.created_at;

      // Only update if:
      // 1. There is a last_message
      // 2. User hasn't read it or their last read is older
      if (
        lastMessageTime &&
        (!userLastRead ||
          userLastRead.toMillis?.() < lastMessageTime.toMillis?.())
      ) {
        await updateDoc(chatRef, {
          [`read_receipts.${currentUser.id}`]: serverTimestamp(),
        });
        console.log("Marked as read");
      } else {
        console.log("Already marked as read");
      }
    } catch (err) {
      console.error("Failed to mark as read:", err.message);
    }
  };

  // const listenToUserProfiles = (userIds, onUpdate) => {
  //   const unsubscribers = [];
  //   const profiles = {};

  //   try {
  //     userIds.forEach((uid) => {
  //       const userRef = doc(db, "users", uid);

  //       const unsubscribe = onSnapshot(
  //         userRef,
  //         (docSnap) => {
  //           if (docSnap.exists()) {
  //             const data = docSnap.data();
  //             profiles[uid] = {
  //               id: uid,
  //               name: data.first_name + " " + data.last_name || "",
  //               profilePicUrl: data.profile_pic_url || "",
  //             };

  //             const result = Object.values(profiles);
  //             console.log(`👤 Updated profiles (${result.length}):`, result);
  //             onUpdate(result);
  //           } else {
  //             console.warn(`Follower user document not found: ${uid}`);
  //           }
  //         },
  //         (error) => {
  //           console.error(`❌ Error listening to user profile ${uid}:`, error);
  //         }
  //       );

  //       unsubscribers.push(unsubscribe);
  //     });
  //   } catch (error) {
  //     console.error("❌ Exception in listenToUserProfiles:", error);
  //   }

  //   return () => {
  //     unsubscribers.forEach((unsub) => unsub());
  //   };
  // };

  useEffect(() => {
  if (newChat) {
    console.log("Setting initial chat from newChat");
    setChat(newChat);
  }
}, [newChat]);


  useEffect(() => {
    console.log("UID ISSSSSSSSSSSSSSSSSSSSs " + uid);
    // console.log("CHAT IN MD ----------------------- ", chat.type);
  });

  useEffect(() => {
    if (chatId && uid) {
      markChatAsRead(chatId, uid);
    }

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("created_at")
    );

    const chatRef = doc(db, "chats", chatId);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMessages(msgs);
    });

    const unsubscribeChat = onSnapshot(chatRef, (docSnap) => {
      if (docSnap.exists()) {
        const chatData = docSnap.data();
        setChat(chatData);

        console.log("Chat Set Successfully", token + chatData.participants);

        // ✅ Fetch user info for participants from your backend
        (async () => {
          console.log("Data here", localhost + token + chatData.participants);
          try {
            const res = await fetch(`${localhost}/users/batch`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // if required
              },
              body: JSON.stringify({
                userIds: chatData.participants, // assumed field
              }),
            });

            if (!res.ok) throw new Error("Failed to fetch users");

            const users = await res.json();
            console.log("USERS " + JSON.stringify(users));
            // Set user data in state
            setParticipantProfiles(users);
          } catch (error) {
            console.error("Error fetching participant profiles:", error);
          }
        })();
      } else {
        console.warn("Chat not found");
      }
    });

    return () => {
      unsubscribe();
      unsubscribeChat();
    };
  }, [chatId]);

  const handleSend = async (chatId, messageText) => {
    try {
      const currentUser = user;

      if (!currentUser) {
        console.error("No authenticated user found.");
        return;
      }

      const currentUserId = currentUser.id;

      if (!messageText.trim()) {
        console.warn("Empty message not sent.");
        return;
      }

      // Reference to messages subcollection
      const messagesRef = collection(db, "chats", chatId, "messages");

      const newMessage = {
        text: messageText,
        sender_id: currentUserId,
        created_at: serverTimestamp(),
      };

      // Add the message to the messages subcollection
      await addDoc(messagesRef, newMessage);

      // Update the parent chat document
      const chatRef = doc(db, "chats", chatId);

      await updateDoc(chatRef, {
        last_message: {
          ...newMessage,
          created_at: serverTimestamp(), // store again since `addDoc` doesn't return it immediately
        },
        [`read_receipts.${currentUserId}`]: serverTimestamp(),
      });

      console.log("Message sent with subcollection!");
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  const onSendMessage = async () => {
    if (newMessage.trim()) {
      await handleSend(chatId, newMessage);
      setNewMessage(""); // Clear the message input after sending
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: woo_white }}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={styles.container}
        keyboardVerticalOffset={80}
      >
        <View style={styles.header}>
          <View
            style={{
              // backgroundColor: "blue",
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Pressable onPress={() => navigation.navigate("MessagesPreview")}>
              <FontAwesome6Icon
                name="chevron-left"
                size={24}
                color={woo_black}
                style={{ marginEnd: 10 }}
              />
            </Pressable>
            {chat && (
              <View style={styles.avatarRow}>
                {participantProfiles.slice(0, 5).map((user, index) => (
                  <View
                    key={user.user_id}
                    style={[
                      styles.avatarWrapper,
                      index !== 0 && styles.overlap,
                    ]}
                  >
                    <Avatar
                      name={`${user.first_name} ${user.last_name}`}
                      image={user.profile_pic_url}
                      size={36}
                    />
                  </View>
                ))}

                {participantProfiles.length > 5 && (
                  <View style={[styles.avatarWrapper, styles.overlap]}>
                    <View style={styles.extraAvatar}>
                      <Text style={styles.extraText}>
                        +{participantProfiles.length - 5}
                      </Text>
                    </View>
                  </View>
                )}

                {participantProfiles.length > 0 && chat.owner_id === uid && (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("ManageParticipants", { chatId })
                    }
                    style={styles.managePill}
                  >
                    <Ionicons name="people-outline" size={14} color="#007BFF" />
                    <Text style={styles.manageText}>Manage</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
          {/* <View
            style={{
              flex: 1,
              // backgroundColor: "red",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Pressable onPress={() => navigation.navigate("MigoGroups")}>
              <FontAwesome6Icon name="phone" size={26} color={woo_black} />
            </Pressable>

            <Pressable
              style={{ marginHorizontal: 10, marginStart: 15 }}
              onPress={() => navigation.navigate("MigoRequests")}
            >
              <FontAwesome6Icon name="video" size={26} color={woo_black} />
            </Pressable>
          </View> */}
        </View>
        <Text
          style={{
            fontSize: 18,
            color: woo_black,
            // marginStart: 20,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {chat && chat.type == "group" && chat.name}
        </Text>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const user = participantProfiles.find(
              (u) => u.user_id === item.sender_id
            );
            console.log("MI USER " + JSON.stringify(user));
            const profilePic = user.profile_pic_url;
            const name = user.first_name + " " + user.last_name;
            console.log("USER IN DETAILS " + JSON.stringify(item));
            return (
              <View
                style={[
                  styles.messageBubble,
                  item.sender_id === uid ? styles.sent : styles.received,
                ]}
              >
                {chat && chat.type === "group" && item.sender_id !== uid && (
                  <Avatar image={profilePic} name={name} />
                )}
                <View style={{ maxWidth: "75%" }}>
                  <Text
                    style={[
                      styles.messageText,
                      !item.sender_id === uid && styles.receivedText,
                    ]}
                  >
                    {item.text}
                  </Text>
                </View>
              </View>
            );
          }}
          // inverted
          contentContainerStyle={styles.messageList}
        />

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Type a message"
            value={newMessage}
            onChangeText={setNewMessage}
            style={styles.input}
          />
          <TouchableOpacity onPress={onSendMessage} style={styles.sendButton}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: woo_white },
  header: {
    height: 50,
    // alignItems: "flex-end",
    flexDirection: "row",
    paddingHorizontal: 20,
    // marginBottom: 5,
  },
  messageList: { padding: 10 },
  messageBubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  sent: {
    alignSelf: "flex-end",
    backgroundColor: "#007BFF",
  },
  received: {
    alignSelf: "flex-start",
    backgroundColor: woo_gray,
  },
  messageText: { color: woo_white },
  receivedText: {
    color: woo_black,
  },

  timestamp: {
    fontSize: 10,
    marginTop: 4,
    color: "#eee",
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderTopColor: "#ccc",
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
  },
  sendButton: {
    backgroundColor: "#007BFF",
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    padding: 10,
    marginVertical: 4,
    borderRadius: 10,
    maxWidth: "80%",
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
});

export default MessageDetailsScreen;
