import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import SuggestedUserCard from "./SuggestedUserCard";
import { Ionicons } from "@expo/vector-icons";
import { debounce } from "lodash";
import { woo_gray } from "../assets/colors";
import FollowButton from "./FollowButton";

const ListViewUsers = ({
  users = [],
  token,
  showSearch = false,
  searchEndpoint = null, // endpoint?query=
  mode = "local-first", // local-only, remote-only, local-first
  onPressUser,
}) => {
  const [search, setSearch] = useState("");
  const [remoteUsers, setRemoteUsers] = useState([]);

  const fetchRemote = useCallback(
    async (q) => {
      if (!q || !searchEndpoint) return;

      try {
        const res = await fetch(searchEndpoint + q, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) return;

        const data = await res.json();
        setRemoteUsers(data);
      } catch (err) {
        console.error("remote search error", err);
      }
    },
    [searchEndpoint, token]
  );

  const debouncedFetch = useMemo(
    () => debounce(fetchRemote, 300),
    [fetchRemote]
  );

  useEffect(() => {
    if (!search) {
      setRemoteUsers([]);
      return;
    }

    debouncedFetch(search.trim());
  }, [search]);

  const filterLocal = (list) =>
    list.filter((u) => u.username.toLowerCase().includes(search.toLowerCase()));

  const localFiltered = mode !== "remote-only" ? filterLocal(users) : [];
  const remoteFiltered = mode !== "local-only" ? filterLocal(remoteUsers) : [];

  const combined = [...localFiltered, ...remoteFiltered];

  const renderItem = ({ item }) => (
    <SuggestedUserCard
      user={item}
      onPress={onPressUser}
      isRow={true}
      side={<FollowButton profileId={item.user_id} />}
    />
  );

  return (
    <View style={{ padding: 16 }}>
      {showSearch && (
        <View style={styles.searchWrapper}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search users…"
            autoCapitalize="none"
            style={styles.input}
          />
          {search !== "" && (
            <TouchableOpacity
              style={styles.clearIcon}
              onPress={() => setSearch("")}
            >
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      )}
      <FlatList
        data={combined}
        keyExtractor={(item) => item.user_id?.toString() || item.uuid}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 10,
    paddingVertical: 8,
    height: 40,
    borderRadius: 8,
    paddingRight: 36,
  },
  clearIcon: {
    position: "absolute",
    right: 8,
    top: "50%",
    marginTop: -10,
  },
  empty: {
    textAlign: "center",
    color: woo_gray,
    marginTop: 20,
  },
});

export default ListViewUsers;
