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
  Modal,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import { woo_black, woo_gray, woo_white } from "../assets/colors";
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
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { AuthContext } from "../context/AuthContext";
import { getTimeAgoOrDate, localhost } from "./utility";

// ----------- Cross-platform Menu Component -----------
const ChatMenu = ({ visible, onClose, options }) => (
  <Modal transparent visible={visible} animationType="fade">
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.menuOverlay}>
        <View style={styles.menuCard}>
          {options.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                item.onPress();
                onClose();
              }}
              style={styles.menuItem}
            >
              <Text
                style={[
                  styles.menuText,
                  item.destructive && { color: "#FF4C4C" },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);

// ----------- Main Screen -----------
const MessageDetailsScreen = ({ route, navigation }) => {
  const { chatId, newChat, uid } = route.params;
  const { token, user } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chat, setChat] = useState();
  const [participantProfiles, setParticipantProfiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);

  // ----- Mark chat read -----
  const markChatAsRead = async () => {
    if (!chatId || !uid) return;
    const chatRef = doc(db, "chats", chatId);
    const chatSnap = await getDoc(chatRef);
    if (!chatSnap.exists()) return;

    const chatData = chatSnap.data();
    const lastMessageTime = chatData.last_message?.created_at;
    const userLastRead = chatData.read_receipts?.[uid];

    if (
      !userLastRead ||
      lastMessageTime?.toMillis() > userLastRead?.toMillis()
    ) {
      await updateDoc(chatRef, {
        [`read_receipts.${uid}`]: serverTimestamp(),
        [`unread_counts.${uid}`]: 0,
      });
    }
  };

  useEffect(() => {
    if (newChat) setChat(newChat);
  }, [newChat]);

  useEffect(() => {
    if (chatId && uid) markChatAsRead();

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("created_at"),
    );
    const chatRef = doc(db, "chats", chatId);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    const unsubscribeChat = onSnapshot(chatRef, async (docSnap) => {
      if (!docSnap.exists()) return;
      const chatData = docSnap.data();
      setChat(chatData);

      try {
        const res = await fetch(`${localhost}/users/batch`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userIds: chatData.participants }),
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const users = await res.json();
        setParticipantProfiles(users);
      } catch (err) {
        console.error(err);
      }
    });

    return () => {
      unsubscribe();
      unsubscribeChat();
    };
  }, [chatId]);

  // ----- Send Message -----
  const handleSend = async (chatId, text) => {
    if (!text.trim()) return;
    const messagesRef = collection(db, "chats", chatId, "messages");
    const messagePayload = {
      text,
      sender_id: uid,
      created_at: serverTimestamp(),
    };
    await addDoc(messagesRef, messagePayload);

    const unreadIncrements = chat.participants
      .filter((id) => id !== uid)
      .reduce((acc, id) => {
        acc[`unread_counts.${id}`] = increment(1);
        return acc;
      }, {});

    const chatRef = doc(db, "chats", chatId);
    await updateDoc(chatRef, {
      last_message: { ...messagePayload, created_at: serverTimestamp() },
      [`read_receipts.${uid}`]: serverTimestamp(),
      [`unread_counts.${uid}`]: 0,
      ...unreadIncrements,
    });
    setNewMessage("");
  };

  const onSendMessage = () => handleSend(chatId, newMessage);

  // ----- Leave / Delete Chat -----
  const leaveChat = () => {
    const isGroup = chat?.type === "group";
    Alert.alert(
      isGroup ? "leave group?" : "delete chat?",
      isGroup
        ? "you will no longer receive messages from this group."
        : "this chat will be removed from your inbox.",
      [
        { text: "cancel", style: "cancel" },
        {
          text: isGroup ? "leave" : "delete",
          style: "destructive",
          onPress: isGroup ? leaveGroupChat : leaveDirectChat,
        },
      ],
    );
  };

  // ----- Remove User From Chat -----
  const removeUserFromGroupChat = (uuid) => {
    const isGroup = chat?.type === "group";
    Alert.alert(
      "remove user?",
      "the user will be permanently removed from this group chat.",
      [
        { text: "cancel", style: "cancel" },
        {
          text: "remove",
          style: "destructive",
          onPress: () => removeUserByAdmin(uuid),
        },
      ],
    );
  };

  const leaveGroupChat = async () => {
    const chatRef = doc(db, "chats", chatId);
    const remaining = chat.participants.filter((id) => id !== uid);
    const updates = {
      participants: remaining,
      [`removed.${uid}`]: { removed_by: uid, removed_at: serverTimestamp() },
    };
    if (chat.owner_id === uid && remaining.length > 0)
      updates.owner_id = remaining[0];
    await updateDoc(chatRef, updates);
    navigation.goBack();
  };

  const leaveDirectChat = async () => {
    try {
      const chatRef = doc(db, "chats", chatId);

      // Remove yourself from participants
      await updateDoc(chatRef, {
        participants: chat.participants.filter((id) => id !== uid),
        [`removed.${uid}`]: {
          removed_by: uid,
          removed_at: serverTimestamp(),
        },
      });

      // Fetch updated chat
      const chatSnap = await getDoc(chatRef);

      // If no participants remain, delete chat
      if (!chatSnap.exists() || chatSnap.data().participants.length === 0) {
        await deleteDoc(chatRef);
      }

      // Navigate back only after Firestore updates
      navigation.goBack();
    } catch (err) {
      console.error("Failed to leave direct chat:", err);
      // Only show alert if it's a real unexpected error
      if (!err.message.includes("deleteDoc")) {
        Alert.alert("Error", "Failed to leave chat. Please try again.");
      } else {
        // Ignore deleteDoc import errors now that we've fixed imports
      }
    }
  };

  const removeUserByAdmin = async (userIdToRemove) => {
    if (!chat || chat.type !== "group") return;
    if (chat.owner_id !== uid) return; // only owner/admin can remove

    try {
      const chatRef = doc(db, "chats", chatId);

      // Update Firestore: remove participant and log removal
      await updateDoc(chatRef, {
        participants: chat.participants.filter((id) => id !== userIdToRemove),
        [`removed.${userIdToRemove}`]: {
          removed_by: uid,
          removed_at: serverTimestamp(),
        },
      });

      // Update local state
      setParticipantProfiles((prev) =>
        prev.filter((u) => u.user_id !== userIdToRemove),
      );
      setSelectedUsers((prev) =>
        prev.filter((u) => u.user_id !== userIdToRemove),
      );

      console.log(`User ${userIdToRemove} removed by admin`);
    } catch (err) {
      console.error("Failed to remove user:", err);
    }
  };

  // ----- Menu Options -----
  const menuOptions = [
    {
      id: "view",
      label: chat?.type === "group" ? "view participants" : "view profile",
      onPress:
        chat?.type === "group"
          ? () => {
              navigation.navigate("ParticipantsScreen", {
                uid: uid,
                participants: participantProfiles,
                chatOwner: chat?.owner_id,
              });
            }
          : () => {
              navigation.navigate("Profile", {
                userUID: chat.participants.find((u) => u.user_id !== uid),
              });
            },
    },
    {
      id: "manage",
      label: "manage users",
      onPress: () => {
        (setSelectedUsers(participantProfiles), setShowModal(true));
      },
      hide: chat?.owner_id !== uid || chat?.type !== "group",
    },
    { id: "mute", label: "mute chat", onPress: () => {} },
    {
      id: "leave",
      label: chat?.type === "group" ? "leave chat" : "delete chat",
      destructive: true,
      onPress: leaveChat,
    },
    {
      id: "block",
      label: "block user",
      destructive: true,
      onPress: () => {},
      hide: chat?.type === "group",
    },
  ].filter((o) => !o.hide);

  // ----- Render -----
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: woo_white }}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding" })}
        style={{ flex: 1 }}
        keyboardVerticalOffset={80}
      >
        <View style={styles.header}>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
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
              </View>
            )}
          </View>

          {/* HEADER MENU BUTTON */}
          <Pressable
            onPress={() => setMenuVisible(true)}
            style={{ padding: 8 }}
          >
            <FontAwesome6Icon
              name="ellipsis-vertical"
              size={24}
              color={woo_black}
            />
          </Pressable>
        </View>

        {/* Messages */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          renderItem={({ item, index }) => {
            const prevMessage = index > 0 ? messages[index - 1] : null;
            const nextMessage =
              index < messages.length - 1 ? messages[index + 1] : null;
            const createdAt =
              item.created_at?.toDate?.() ??
              (item.created_at?.seconds
                ? new Date(item.created_at.seconds * 1000)
                : null);
            const prevCreatedAt =
              prevMessage?.created_at?.toDate?.() ??
              (prevMessage?.created_at?.seconds
                ? new Date(prevMessage.created_at.seconds * 1000)
                : null);

            const isSameDay = (a, b) =>
              a &&
              b &&
              a.getFullYear() === b.getFullYear() &&
              a.getMonth() === b.getMonth() &&
              a.getDate() === b.getDate();
            const getDayLabel = (date) => {
              const today = new Date();
              const yesterday = new Date();
              yesterday.setDate(today.getDate() - 1);
              if (isSameDay(date, today)) return "Today";
              if (isSameDay(date, yesterday)) return "Yesterday";
              return date.toLocaleDateString();
            };

            const isSentByCurrentUser = item.sender_id === uid;
            const isNextSameSender = nextMessage?.sender_id === item.sender_id;
            const isPrevSameSender = prevMessage?.sender_id === item.sender_id;

            const showDaySeparator =
              createdAt &&
              (!prevCreatedAt || !isSameDay(createdAt, prevCreatedAt));
            const showTimestamp = !isNextSameSender;

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
              <>
                {showDaySeparator && (
                  <View style={{ alignItems: "center", marginVertical: 12 }}>
                    <View
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 4,
                        borderRadius: 12,
                        backgroundColor: "#eee",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#666",
                          fontWeight: "500",
                        }}
                      >
                        {getDayLabel(createdAt)}
                      </Text>
                    </View>
                  </View>
                )}
                <View
                  style={{
                    flexDirection: isSentByCurrentUser ? "row-reverse" : "row",
                  }}
                >
                  <View style={[bubbleStyle, { maxWidth: "75%" }]}>
                    <Text style={styles.messageText}>{item.text}</Text>
                  </View>
                </View>
                {showTimestamp && createdAt && (
                  <Text
                    style={{
                      fontSize: 11,
                      color: "#999",
                      marginTop: 2,
                      alignSelf: isSentByCurrentUser
                        ? "flex-end"
                        : "flex-start",
                    }}
                  >
                    {getTimeAgoOrDate(createdAt)}
                  </Text>
                )}
              </>
            );
          }}
        />

        {/* Input */}
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

        {/* Manage Users Modal */}
        <Modal visible={showModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>manage users</Text>
              <FlatList
                data={selectedUsers}
                keyExtractor={(item) => item.uuid}
                renderItem={({ item }) => (
                  <View style={styles.modalUserRow}>
                    <Avatar
                      name={item.username}
                      image={item.profile_pic_url}
                      size={36}
                    />
                    <Text style={styles.modalUsername}>{item.username}</Text>
                    <TouchableOpacity onPress={() => removeUserFromGroupChat(item.user_id)}>
                      <Ionicons
                        name="remove-circle"
                        size={22}
                        color="#FF4C4C"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={styles.modalClose}
              >
                <Text style={styles.modalCloseText}>close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Menu */}
        <ChatMenu
          visible={menuVisible}
          onClose={() => setMenuVisible(false)}
          options={menuOptions}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ----------- Styles -----------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: woo_white },
  header: {
    height: 50,
    flexDirection: "row",
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: woo_white,
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

  timeText: {
    fontSize: 11,
    marginTop: 4,
    opacity: 0.6,
  },

  timeSent: {
    textAlign: "right",
    color: "#fff",
  },

  timeReceived: {
    textAlign: "left",
    color: "#555",
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
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  menuCard: {
    marginTop: 50,
    marginRight: 10,
    backgroundColor: woo_white,
    borderRadius: 8,
    paddingVertical: 5,
    minWidth: 180,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: { paddingVertical: 12, paddingHorizontal: 16 },
  menuText: { fontSize: 18, color: woo_black },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "80%",
    maxHeight: "70%",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  modalUserRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  modalUsername: { flex: 1, marginLeft: 10 },
  modalClose: { marginTop: 25, alignSelf: "center" },
  modalCloseText: { color: "#007BFF", fontWeight: "600" },
});

export default MessageDetailsScreen;
