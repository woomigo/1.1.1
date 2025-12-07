import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from "react-native";
import UserCard from "./UserCard";
import { Ionicons } from "@expo/vector-icons";
import { debounce } from "lodash";
import { woo_gray } from "../assets/colors";
import FollowButton from "./FollowButton";
import { Icon, Input } from "@rneui/themed";

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

  const clearSearch = () => {
    setSearch("");
    setRemoteUsers([]);
    Keyboard.dismiss();
  };

  const renderItem = ({ item }) => (
    <UserCard
      user={item}
      onPress={() => {
        onPressUser?.(item);
      }}
      isRow={true}
      side={<FollowButton textIcon={true} profileId={item.user_id} />}
    />
  );

  return (
    <View style={{ padding: 16 }}>
      {showSearch && (
        <View style={styles.wrapper}>
          <View style={styles.inputWrapper}>
            <Input
              fontSize={14}
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={Keyboard.dismiss}
              // ref={listRef}
              placeholder={"search by @username"}
              leftIcon={
                <Icon
                  style={{ paddingEnd: 5 }}
                  type="font-awesome-5"
                  name={"search"}
                  size={18}
                />
              }
              autoCapitalize="none"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={clearSearch} style={styles.clearIcon}>
                <Ionicons name="close-circle" size={20} color="#aaa" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        // <View style={styles.searchWrapper}>
        //   <TextInput
        //     value={search}
        //     onChangeText={setSearch}
        //     placeholder="Search users…"
        //     autoCapitalize="none"
        //     style={styles.input}
        //   />
        //   {search !== "" && (
        //     <TouchableOpacity
        //       style={styles.clearIcon}
        //       onPress={() => setSearch("")}
        //     >
        //       <Ionicons name="close-circle" size={20} color="#888" />
        //     </TouchableOpacity>
        //   )}
        // </View>
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
  wrapper: {
    marginTop: 10,
    paddingHorizontal: 16,
    width: "100%",
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingRight: 35,
  },
  clearIcon: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  empty: {
    textAlign: "center",
    color: woo_gray,
    marginTop: 20,
  },
});

export default ListViewUsers;
