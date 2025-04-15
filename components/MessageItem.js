import React, { useEffect, useRef, useState } from "react";
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

const MessageItem = ({ item, onPress, onLongPress, onMarkAsRead, uid }) => {
  const [user, setUser] = useState({});
  const swipeableRef = useRef(null);
  const dotAnim = useRef(new Animated.Value(0)).current;

  const markChatAsRead = async (chatId) => {
    swipeableRef.current?.close(); // Auto close the swipeable
    try {
      const currentUser = auth.currentUser;
      if (!uid) throw new Error("User not authenticated");

      const chatRef = doc(db, "chats", chatId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        console.warn("Chat not found");
        return;
      }

      const chatData = chatSnap.data();
      const userLastRead = chatData.read_receipts?.[currentUser.uid];
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
          [`read_receipts.${currentUser.uid}`]: serverTimestamp(),
        });
        console.log("Marked as read");
      } else {
        console.log("Already marked as read");
      }
    } catch (err) {
      console.error("Failed to mark as read:", err.message);
    }
  };

  const listenToUser = (userId, onUpdate, onError) => {
    const userRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(
      userRef,
      (docSnap) => {
        if (docSnap.exists()) {
          onUpdate({ uid: docSnap.id, ...docSnap.data() });
        } else {
          console.warn("User not found");
        }
      },
      (error) => {
        console.error("Error listening to user:", error);
        onError?.(error);
      }
    );

    return unsubscribe;
  };

  const excludeNumber = (arr, number) => {
    return arr.filter((n) => n !== number);
  };

  const getParticipants = excludeNumber(item.participants, uid);
  const userUID = getParticipants[0];
  const isUnread = !item.read_receipts?.[uid];

  useEffect(() => {
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

    const unsubscribe = listenToUser(
      userUID,
      (userData) => {
        console.log("USER " + JSON.stringify(userData));
        setUser(userData);
      },
      (err) => console.error("User listener failed", err)
    );

    return () => unsubscribe();
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
        {user && item.type === "group" ? (
          <Avatar name={item.name} image={item.image} />
        ) : (
          <Avatar
            name={user.first_name + " " + user.last_name}
            image={user.profile_pic_url}
          />
        )}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.sender, isUnread && styles.unread]}>
              {item.type === "group"
                ? item.name
                : user && user.first_name + " " + user.last_name}
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
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#007AFF",
    marginLeft: 8,
  },
});

export default MessageItem;
