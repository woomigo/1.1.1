import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "../components/Avatar";
import { debounce } from "lodash";
import { woo_gray } from "../assets/colors";

const SelectableUserListView = ({
  users = [],
  selectedUsers: initialSelectedUsers = [],
  searchEndpoint = null,
  token = null,
  onChangeSelected,
  mode = "local-first", // remote-only, local-only
}) => {
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState([]);

  const initializedRef = useRef(false);

  useEffect(() => {
    if (
      !initializedRef.current &&
      Array.isArray(initialSelectedUsers) &&
      initialSelectedUsers.length > 0 &&
      selectedUsers.length === 0
    ) {
      setSelectedUsers(initialSelectedUsers);
      initializedRef.current = true;
    }
  }, [initialSelectedUsers]);

  // Normalize user
  const normalizeUser = (u) => ({
    uuid: u.user_id || u.uuid,
    username: u.username,
    profile_pic_url: u.profile_pic_url,
    ...u,
  });

  // normalize local users ONCE
  const normalizedLocalUsers = useMemo(() => {
    return users.map((u) => ({
      ...u,
      uuid: u.user_id || u.uuid,
    }));
  }, [users]);

  // Fetch remote users
  const fetchRemoteUsers = useCallback(
    async (query) => {
      if (!query || !searchEndpoint) return;
      try {
        const res = await fetch(searchEndpoint + query.trim(), {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) return;
        const data = await res.json();
        const normalized = data.map(normalizeUser);
        setRemoteUsers((prev) => {
          const combined = [...prev, ...normalized];
          return combined.filter(
            (u, i) => combined.findIndex((x) => x.uuid === u.uuid) === i
          );
        });
      } catch (err) {
        console.error("[fetchRemoteUsers]", err);
      }
    },
    [searchEndpoint, token]
  );

  const normalizedRemoteUsers = useMemo(
  () => remoteUsers.map(normalizeUser),
  [remoteUsers]
);

  const debouncedRemoteSearch = useMemo(
    () => debounce(fetchRemoteUsers, 300),
    [fetchRemoteUsers]
  );

  // Trigger search
  useEffect(() => {
    if (!search) return setRemoteUsers([]);
    const hasLocal = normalizedLocalUsers.some((u) =>
      u.username.toLowerCase().includes(search.toLowerCase())
    );
    const hasSelected = selectedUsers.some((u) =>
      u.username.toLowerCase().includes(search.toLowerCase())
    );
    if (mode === "remote-only" || (!hasLocal && !hasSelected)) {
      debouncedRemoteSearch(search.trim());
    }
  }, [search, normalizedLocalUsers, selectedUsers]);

  useEffect(() => () => debouncedRemoteSearch.cancel(), []);

  useEffect(() => {
    if (onChangeSelected) onChangeSelected(selectedUsers);
  }, [selectedUsers]);

  useEffect(() => {
    if (search === "") {
      Keyboard.dismiss();
    }
  }, [search]);

  // Filtered lists
  const filterUsers = (list) =>
    list.filter(
      (u) =>
        !selectedUsers.some((s) => s.uuid === u.uuid) &&
        u.username.toLowerCase().includes(search.toLowerCase())
    );

  const localFiltered = filterUsers(normalizedLocalUsers);
  const remoteFiltered = filterUsers(normalizedRemoteUsers);
  const selectedFiltered =
    search.length > 0
      ? selectedUsers.filter((u) =>
          u.username.toLowerCase().includes(search.toLowerCase())
        )
      : [];

  const combinedResults =
    mode === "local-only"
      ? [...localFiltered, ...selectedFiltered]
      : mode === "remote-only"
      ? [...remoteFiltered, ...selectedFiltered]
      : [...localFiltered, ...selectedFiltered, ...remoteFiltered];

  const toggleUser = (user) => {
    if (!selectedUsers.some((u) => u.uuid === user.uuid))
      setSelectedUsers((prev) => [...prev, user]);
    setSearch("");
  };

  const removeUser = (uuid) => {
    setSelectedUsers((prev) => {
      const updated = prev.filter((u) => u.uuid !== uuid);
      if (updated.length === 0) setShowModal(false);
      return updated;
    });
    setSearch("");
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedUsers.some((u) => u.uuid === item.uuid);
    const isLocal = normalizedLocalUsers.some((u) => u.uuid === item.uuid);
    const isRemote = normalizedRemoteUsers.some((u) => u.uuid === item.uuid);

    return (
      <TouchableOpacity
        style={styles.userItem}
        onPress={() => (isSelected ? removeUser(item.uuid) : toggleUser(item))}
      >
        <Avatar name={item.username} image={item.profile_pic_url} size={36} />
        <View
          style={{ marginLeft: 10, flexDirection: "row", alignItems: "center" }}
        >
          <Text style={styles.username}>{item.username}</Text>
          {!isSelected && mode === "local-first" && (
            <>
              {isLocal && <Text style={styles.tagLocal}>follower</Text>}
              {isRemote && <Text style={styles.tagRemote}>suggested</Text>}
            </>
          )}
        </View>
        <Ionicons
          name={isSelected ? "remove-circle-outline" : "add-circle-outline"}
          size={20}
          color={isSelected ? "#FF4C4C" : "#007BFF"}
          style={{ marginLeft: "auto" }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Selected avatars */}
      <View style={styles.avatarRow}>
        {selectedUsers.slice(0, 5).map((user, i) => (
          <View
            key={user.uuid}
            style={[styles.avatarWrapper, i !== 0 && styles.overlap]}
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
              <Text style={styles.extraText}>+{selectedUsers.length - 5}</Text>
            </View>
          </View>
        )}
        {selectedUsers.length > 0 && (
          <TouchableOpacity
            onPress={() => setShowModal(true)}
            style={styles.managePill}
          >
            <Ionicons name="people-outline" size={14} color="#007BFF" />
            <Text style={styles.manageText}>Manage</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search input */}
      <View style={styles.searchWrapper}>
        <TextInput
          placeholder="Search users..."
          style={styles.input}
          value={search}
          onChangeText={(text) => setSearch(text.toLowerCase())}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {search.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setSearch("");
              setRemoteUsers([]);
            }}
            style={styles.clearIcon}
          >
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {/* User list */}
      <FlatList
        data={combinedResults}
        keyExtractor={(item) => item.uuid}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={() => (
          <View
            style={{
              paddingVertical: 20,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <Ionicons
              name="person-outline"
              size={20}
              color="#bbb"
              style={{ marginRight: 8 }}
            />
            <Text style={{ color: woo_gray, fontSize: 15 }}>
              {search ? "No users found." : "Start typing to search users."}
            </Text>
          </View>
        )}
      />

      {/* Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Manage users</Text>
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
                  <TouchableOpacity onPress={() => removeUser(item.uuid)}>
                    <Ionicons name="remove-circle" size={22} color="#FF4C4C" />
                  </TouchableOpacity>
                </View>
              )}
            />
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={styles.modalClose}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  searchWrapper: {
    position: "relative",
    justifyContent: "center",
    marginBottom: 10, // preserve spacing below
  },

  input: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    paddingRight: 36, // space for clear icon
    borderRadius: 8,
    height: 40, // explicit height
  },

  clearIcon: {
    position: "absolute",
    right: 8,
    height: 20,
    width: 20,
    top: "50%",
    marginTop: -10, // half of icon height
  },
  avatarRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  avatarWrapper: { borderWidth: 2, borderColor: "#fff", borderRadius: 36 },
  overlap: { marginLeft: -20 },
  extraAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  extraText: { fontSize: 12, fontWeight: "600" },
  managePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6f0ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    marginLeft: 8,
  },
  manageText: { color: "#007BFF", marginLeft: 4, fontSize: 12 },
  userItem: { flexDirection: "row", paddingVertical: 8, alignItems: "center" },
  username: { fontSize: 16 },
  tagLocal: {
    backgroundColor: "#e0f7fa",
    color: "#00796b",
    fontSize: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  tagRemote: {
    backgroundColor: "#ede7f6",
    color: "#5e35b1",
    fontSize: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
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
  modalClose: { marginTop: 16, alignSelf: "center" },
  modalCloseText: { color: "#007BFF", fontWeight: "600" },
});

export default SelectableUserListView;
