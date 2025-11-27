import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { Header, Icon } from "@rneui/themed";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import ListViewPreviewMessages from "./ListViewPreviewMessages";
import { woo_black } from "../assets/colors";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import MessagesPreview from "./MessagesPreview";
import { AuthContext } from "../context/AuthContext";

const MessagesPreviewScreen = ({ navigation, route }) => {
  const { user, token } = useContext(AuthContext);
  const { uid } = route.params;

  // const [messagers, setMessagers] = useState()
  const [chats, setChats] = useState([]);
  const [unreadChats, setUnreadChats] = useState();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", user.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChats(data);
      console.log("CHATS AT MPS MPS MPS " + JSON.stringify(data))
    });



    const unsubscribeUnread = listenToUnreadChats(user.id, setUnreadChats);

    return () => {
      unsubscribe();
      unsubscribeUnread();
    };
  }, []);

  const listenToUnreadChats = (uid, onUpdate) => {
    try {
      const chatsRef = collection(db, "chats");
      const q = query(
        chatsRef,
        where("participants", "array-contains", uid)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const unreadChats = [];

          snapshot.forEach((doc) => {
            const data = doc.data();
            const chatId = doc.id;
            const lastMessage = data.last_message;
            const userLastRead = data.read_receipts?.[uid];

            const lastRead = userLastRead?.toDate?.().getTime?.() || 0;
            const lastMessageTime =
              lastMessage?.created_at?.toDate?.().getTime?.() || 0;

            if (lastMessageTime > lastRead) {
              unreadChats.push({ ...data, chat_id: chatId });
            }
          });

          onUpdate(unreadChats);
        },
        (error) => {
          console.error("❌ Error fetching unread chats:", error);
          onUpdate([]);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error("❌ Exception in listenToUnreadChats:", error);
      return () => {};
    }
  };

  const unreadCount =
    unreadChats && unreadChats.length > 0 && unreadChats.length;

  // const handleMarkAsRead = (updatedMessage) => {
  //   // setMessages((prevMessages) =>
  //   //   prevMessages.map((msg) =>
  //   //     msg.id === updatedMessage.id ? updatedMessage : msg
  //   //   )
  //   // );
  //   console.log(JSON.stringify(updatedMessage) + " marked as read");
  // };

  const handleArchive = (id) => {
    // setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
    console.log(JSON.stringify(id) + " marked as archived");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View
          style={{
            flex: 3,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              fontSize: 22,
              color: woo_black,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            messages
          </Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <FontAwesome6Icon
            name="pen-to-square"
            size={26}
            color={woo_black}
            onPress={() => navigation.navigate("NewMessage")}
          />
          <FontAwesome6Icon name="ellipsis" size={26} color={woo_black} />
        </View>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            flex: 1,
            height: 1,
            backgroundColor: "#b3b3b3",
            marginHorizontal: 10,
            marginVertical: 10,
          }}
        />
      </View>

      <MessagesPreview
        messages={chats}
        onSelectMessage={(msg) => console.log("Open:", msg)}
        onNewMessage={() => console.log("Start new convo")}
        onArchive={handleArchive}
        uid={uid}
      />

      {/* <ListViewPreviewMessages uid={uid} messagers={messagers} /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileInfo: {
    textAlign: "center",
  },
  header: {
    height: 50,
    alignItems: "flex-end",
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  leftComponent: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerComponent: {
    justifyContent: "center",
    alignItems: "center",
  },
  rightComponent: {
    justifyContent: "center",
    alignItems: "center",
  },
  unreadBadge: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  unreadBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default MessagesPreviewScreen;
