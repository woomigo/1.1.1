import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "../components/Avatar"; // Your avatar component

const SelectableUserListView = ({ users, returnSelectedUsers }) => {
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showAllUsers, setShowAllUsers] = useState(false);

  useEffect(() => {
    returnSelectedUsers(selectedUsers);
  }, [selectedUsers]);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(search.toLowerCase()) &&
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

  return (
    <View style={styles.container}>
      <View style={styles.subHeader}>
        <View
          style={{
            //   backgroundColor: "blue",
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          {/* Selected users */}
          <View style={styles.avatarRow}>
            {selectedUsers.slice(0, 5).map((user, index) => (
              <View
                key={user.id}
                style={[styles.avatarWrapper, index !== 0 && styles.overlap]}
              >
                <Avatar
                  name={user.username}
                  image={user.profile_pic_url}
                  size={36}
                />
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
            <Avatar name={item.name} image={item.profile_pic_url} size={36} />
            <Text style={styles.userName}>{item.username}</Text>
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
      <Modal
        visible={showAllUsers}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAllUsers(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>manage woo migos</Text>
            <FlatList
              data={selectedUsers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.modalUserRow}>
                  <Avatar
                    name={item.username}
                    image={item.profile_pic_url}
                    size={36}
                  />
                  <Text style={{ marginLeft: 10, flex: 1 }}>
                    {item.username}
                  </Text>
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
    </View>
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
  subHeader: {
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
});

export default SelectableUserListView;
