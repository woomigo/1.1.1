import { useContext, useEffect, useRef, useState } from "react";
import { View, Text, Animated, StyleSheet, Pressable } from "react-native";
import Avatar from "./Avatar";
import { Ionicons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import {
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { AuthContext } from "../context/AuthContext";
import { localhost } from "./utility";

const MessageItem = ({ item, onPress, onLongPress, onMarkAsRead, uid }) => {
  const { token, user } = useContext(AuthContext);

  const [chatUser, setUser] = useState({});
  const swipeableRef = useRef(null);
  const dotAnim = useRef(new Animated.Value(0)).current;

  const markChatAsRead = async (chatId) => {
    swipeableRef.current?.close(); // Auto close the swipeable
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

  const findUserById = async (id) => {
    try {
      const res = await fetch(`${localhost}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      console.log(`SEARCH DATA JSON ${JSON.stringify(data)}`);
      setUser(data);
    } catch (error) {
      console.error("ERROR AT MESSAGE ITEM IS - ", error);
    }
  };

  const excludeNumber = (arr, number) => {
    return arr.filter((n) => n !== number);
  };

  const getParticipants = excludeNumber(item.participants, user.id);
  const userUID = getParticipants[0];
  const lastMessageTime = item.last_message?.created_at;
  const lastReadTime = item.read_receipts?.[uid];
  const unreadCount = item.unread_counts?.[user.id] || 0;

  const isUnread =
    lastMessageTime &&
    (!lastReadTime || lastReadTime.toMillis?.() < lastMessageTime.toMillis?.());

  useEffect(() => {
    console.log("MI UID ", uid);
    console.log("ITEM " + JSON.stringify(item.read_receipts));
    console.log("USERUID " + JSON.stringify(userUID));
    console.log("ISUNREAD " + isUnread);

    if (isUnread) {
      Animated.spring(dotAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 4,
      }).start();
    }

    findUserById(userUID);

    console.log("WTF IS HERE" + getParticipants);
  }, [isUnread, userUID]);

  const renderRightActions = () => (
    <View style={styles.swipeAction}>
      <Ionicons name="checkmark-circle-outline" size={24} color="#fff" />
      <Text style={styles.swipeText}>Mark as Read</Text>
    </View>
  );

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      onSwipeableOpen={() => markChatAsRead(item.id)}
      ref={swipeableRef}
    >
      <Pressable
        onPress={() => onPress?.(item)}
        onLongPress={() => onLongPress?.(item)}
        style={({ pressed }) => [styles.container, pressed && { opacity: 0.7 }]}
      >
        {chatUser && item.type === "group" ? (
          <Avatar name={item.name} image={item.image} />
        ) : (
          <Avatar
            name={chatUser.first_name + " " + chatUser.last_name}
            image={chatUser.profile_pic_url}
          />
        )}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.sender, isUnread && styles.unread]}>
              {item.type === "group"
                ? item.name
                : chatUser && chatUser.first_name + " " + chatUser.last_name}
            </Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>

          <View style={styles.row}>
            <Text
              style={[styles.preview, isUnread && styles.unread]}
              numberOfLines={1}
            >
              {item.last_message && item.last_message.text}
            </Text>
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Text>
              </View>
            )}
            {isUnread && (
              <Animated.View
                style={[
                  styles.unreadDot,
                  {
                    transform: [{ scale: dotAnim }],
                    opacity: dotAnim,
                  },
                ]}
              />
            )}
          </View>
        </View>
      </Pressable>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  swipeAction: {
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
  },
  swipeText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  sender: {
    fontWeight: "600",
    fontSize: 16,
  },
  preview: {
    flex: 1,
    color: "#444",
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
  },
  unread: {
    fontWeight: "bold",
    color: "#000",
  },
  badge: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#007AFF",
    marginLeft: 8,
  },
});

export default MessageItem;
