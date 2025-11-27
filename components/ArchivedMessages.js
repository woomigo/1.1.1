import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { Ionicons } from "@expo/vector-icons";
import MessageItem from "./MessageItem";

const ArchivedMessages = ({ messages, onUnarchive, onSelectMessage }) => {
  const [searchText, setSearchText] = useState("");

  const filteredArchived = messages.filter(
    (msg) =>
      msg.archived &&
      (msg.sender.toLowerCase().includes(searchText.toLowerCase()) ||
        msg.text.toLowerCase().includes(searchText.toLowerCase()))
  );

  const renderItem = ({ item }) => (
    <MessageItem item={item} onPress={onSelectMessage} />
  );

  const renderHiddenItem = (data) => {
    const handleUnarchive = () => {
      Alert.alert(
        "Unarchive Message",
        `Unarchive message from "${data.item.sender}"?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Unarchive",
            style: "default",
            onPress: () => onUnarchive({ ...data.item, archived: false }),
          },
        ]
      );
    };

    return (
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={styles.unarchiveButton}
          onPress={handleUnarchive}
        >
          <Ionicons name="arrow-undo-outline" size={24} color="#fff" />
          <Text style={styles.unarchiveText}>Unarchive</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Archived</Text>
      </View>

      {/* Search */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search archived messages..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <SwipeListView
        data={filteredArchived}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-80}
        disableLeftSwipe
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  header: {
    marginBottom: 12,
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
    backgroundColor: "#4cd964",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  unarchiveButton: {
    alignItems: "center",
  },
  unarchiveText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
  },
});

export default ArchivedMessages;
