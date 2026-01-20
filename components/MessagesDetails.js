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
  increment,
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

      if (
        lastMessageTime &&
        (!userLastRead ||
          userLastRead.toMillis?.() < lastMessageTime.toMillis?.())
      ) {
        await updateDoc(chatRef, {
          [`read_receipts.${currentUser.id}`]: serverTimestamp(),
          [`unread_counts.${currentUser.id}`]: 0,
        });
        console.log("Marked as read");
      } else {
        console.log("Already marked as read");
      }
    } catch (err) {
      console.error("Failed to mark as read:", err.message);
    }
  };

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

        (async () => {
          console.log("Data here", localhost + token + chatData.participants);
          try {
            const res = await fetch(`${localhost}/users/batch`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                userIds: chatData.participants,
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
      if (!currentUser) return;

      const currentUserId = currentUser.id;

      if (!messageText.trim()) return;

      const messagesRef = collection(db, "chats", chatId, "messages");

      const messagePayload = {
        text: messageText,
        sender_id: currentUserId,
        created_at: serverTimestamp(),
      };

      await addDoc(messagesRef, messagePayload);

      const unreadIncrements = chat.participants
        .filter((uid) => uid !== currentUserId)
        .reduce((acc, uid) => {
          acc[`unread_counts.${uid}`] = increment(1);
          return acc;
        }, {});

      const chatRef = doc(db, "chats", chatId);

      await updateDoc(chatRef, {
        last_message: {
          ...messagePayload,
          created_at: serverTimestamp(),
        },
        [`read_receipts.${currentUserId}`]: serverTimestamp(),
        [`unread_counts.${currentUserId}`]: 0, // safety
        ...unreadIncrements, // 👈 KEY LINE
      });

      console.log("Message sent + unread counts updated");
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

  const renderMessageItem = ({ item, index }) => {
    const user = participantProfiles.find((u) => u.user_id === item.sender_id);
    const profilePic = user?.profile_pic_url;
    const name = user?.first_name + " " + user?.last_name;

    // Determine if avatar should be shown
    const showAvatar =
      index === 0 || messages[index - 1].sender_id !== item.sender_id;

    const isSentByCurrentUser = item.sender_id === uid;

    return (
      <View style={{ flexDirection: "row", marginBottom: showAvatar ? 10 : 2 }}>
        {/* Avatar for received messages only */}
        {!isSentByCurrentUser && showAvatar && (
          <View style={{ marginRight: 8 }}>
            <Avatar image={profilePic} name={name} size={36} />
          </View>
        )}

        <View
          style={[
            styles.messageBubble,
            isSentByCurrentUser ? styles.sent : styles.received,
            { marginLeft: !isSentByCurrentUser && showAvatar ? 0 : 44 }, // indent if avatar hidden
          ]}
        >
          <Text
            style={[
              styles.messageText,
              !isSentByCurrentUser && styles.receivedText,
            ]}
          >
            {item.text}
          </Text>
        </View>
      </View>
    );
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
          contentContainerStyle={styles.messageList}
          renderItem={({ item, index }) => {
            const sender = participantProfiles.find(
              (u) => u.user_id === item.sender_id
            );
            const profilePic = sender?.profile_pic_url;
            const name = sender?.first_name + " " + sender?.last_name;
            const isSentByCurrentUser = item.sender_id === uid;

            // Check previous message
            const prevMessage = index > 0 ? messages[index - 1] : null;
            const nextMessage =
              index < messages.length - 1 ? messages[index + 1] : null;
            const showAvatar =
              !isSentByCurrentUser &&
              (!prevMessage || prevMessage.sender_id !== item.sender_id);
            const isNextSameSender = nextMessage?.sender_id === item.sender_id;
            const isPrevSameSender = prevMessage?.sender_id === item.sender_id;

            // Bubble styling
            const bubbleStyle = [
              styles.messageBubble,
              isSentByCurrentUser ? styles.sent : styles.received,
              {
                borderTopLeftRadius: isPrevSameSender ? 5 : 10,
                borderTopRightRadius: isPrevSameSender ? 5 : 10,
                borderBottomLeftRadius: isNextSameSender ? 5 : 10,
                borderBottomRightRadius: isNextSameSender ? 5 : 10,
                marginTop: isPrevSameSender ? 2 : 10,
              },
            ];

            return (
              <View
                style={{
                  flexDirection: isSentByCurrentUser ? "row-reverse" : "row",
                  alignItems: "flex-start",
                }}
              >
                {/* Avatar: show if first in block */}
                {!isSentByCurrentUser && showAvatar ? (
                  <View style={{ width: 44, marginRight: 8, marginTop: 10 }}>
                    <Avatar image={profilePic} name={name} size={36} />
                  </View>
                ) : (
                  // Reserve space for alignment
                  !isSentByCurrentUser && (
                    <View style={{ width: 44, marginRight: 8 }} />
                  )
                )}

                <View style={[bubbleStyle, { maxWidth: "75%" }]}>
                  <Text
                    style={[
                      styles.messageText,
                      !isSentByCurrentUser && styles.receivedText,
                    ]}
                  >
                    {item.text}
                  </Text>
                </View>
              </View>
            );
          }}
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
    marginBottom: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  sent: {
    alignSelf: "flex-end",
    backgroundColor: "#007BFF",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },

  received: {
    alignSelf: "flex-start",
    backgroundColor: woo_gray,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
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
