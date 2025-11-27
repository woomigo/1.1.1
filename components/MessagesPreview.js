import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { Ionicons } from "@expo/vector-icons";
import MessageItem from "./MessageItem";
import { useNavigation } from "@react-navigation/native";

const MessagesPreview = ({
  //   navigation,
  messages,
  onArchive,
  onMarkAsRead,
  onSelectMessage,
  onNewMessage,
  isUnread,
  uid,
}) => {
  const [searchText, setSearchText] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    console.log("MESSAGES " + JSON.stringify(messages));
  });

  const filteredMessages =
    messages ||
    (searchText &&
      messages.filter(
        (msg) =>
          !msg.archived &&
          (msg.sender.toLowerCase().includes(searchText.toLowerCase()) ||
            msg.text.toLowerCase().includes(searchText.toLowerCase()))
      ));

  const handlePress = (item) => {
    navigation.navigate("MessageDetails", { chatId: item.id, chat: item });
  };

  const handleLongPress = (item) => {
    Alert.alert(
      "Archive Message",
      `Archive conversation with ${item.sender}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Archive",
          onPress: () => onArchive(item.id),
          style: "destructive",
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <MessageItem
      item={item}
      onPress={handlePress}
      onLongPress={handleLongPress}
      onMarkAsRead={onMarkAsRead}
      isUnread={isUnread}
      uid={uid}
    />
    // <MessageItem item={item} onPress={onSelectMessage} />
  );

  return (
    <View style={styles.container}>
      {/* Search */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search messages..."
        value={searchText}
        onChangeText={setSearchText}
      />

      {messages && (
        <FlatList
          data={filteredMessages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
  },

  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#f00",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  archiveButton: {
    alignItems: "center",
  },
  archiveText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#007AFF",
  },
  tabText: {
    color: "#888",
  },
  activeTabText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  readButton: {
    backgroundColor: "#4cd964",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
  },
});

export default MessagesPreview;
