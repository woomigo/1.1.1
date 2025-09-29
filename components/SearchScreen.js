import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
  Dimensions,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Header, Icon, Input, Avatar, Skeleton } from "@rneui/themed";
import { woo_black } from "../assets/colors";
import debounce from "lodash.debounce";
import { SelfIdentity } from "./shared";
import { render } from "react-native-web";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import SearchInput from "./SearchInput";
import { filter } from "lodash";
import ListViewUsers from "./ListViewUsers";

const localhost = "http://192.168.12.240:3000";

const SearchScreen = ({ navigation, route }) => {
  const { user, token } = route.params;

  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

 
  const fetchFilteredUsers = async (query) => {
    if (!query) {
      setFilteredUsers([]);
      return;
    }

    try {
      const res = await fetch(
        `${localhost}/users/search?username=${query.trim()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        setFilteredUsers([]);
        return;
      }

      const data = await res.json();
      console.log(`SEARCH DATA JSON ${JSON.stringify(data)}`);
      setFilteredUsers(data);
    } catch (error) {
      setFilteredUsers([]);
    }
  };

  // Now create debounced function — pass function reference, NOT call
  const debouncedFetchUsers = useRef(debounce(fetchFilteredUsers, 300)).current;

  const handleSearch = (text) => {
    setSearchText(text);
    debouncedFetchUsers(text.trim());
  };

  // Cancel debounce on unmount
  useEffect(() => {
    return () => {
      debouncedFetchUsers.cancel();
    };
  }, []);

  const clearSearch = () => {
    setSearchText("");
    setFilteredUsers([])
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
      <View style={styles.header}>
        <View
          style={{
            // backgroundColor: "blue",
            flex: 3,
            alignItems: "flex-start",
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
            search
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            // backgroundColor: "red",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <FontAwesome6Icon
            name="magnifying-glass"
            size={26}
            color={woo_black}
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

      <View style={styles.wrapper}>
        <View style={styles.inputWrapper}>
          <Input
            fontSize={14}
            value={searchText}
            onChangeText={handleSearch}
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
            //   errorStyle={{ color: 'red' }}
            //   errorMessage={showEmptyMessage && searchText.length > 0 && filtered.length === 0 && emptyMessage}
            autoCapitalize="none"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearIcon}>
              <Ionicons name="close-circle" size={20} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>

        {/* {showEmptyMessage && searchText.length > 0 && filtered.length === 0 && (
          <Text style={styles.emptyMessage}>{emptyMessage}</Text>
        )} */}
      </View>
      <ListViewUsers users={filteredUsers} hideSearchBar />
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
});

export default SearchScreen;
