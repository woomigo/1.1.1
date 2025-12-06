import { useState, useRef, useEffect, useContext } from "react";
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
import { AuthContext } from "../context/AuthContext";
import { localhost } from "./utility";
import SuggestedUserCard from "./SuggestedUserCard";

const SearchScreen = ({ navigation, route }) => {
  const { user, token } = useContext(AuthContext);

  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([
    {
      id: 1,
      username: "johndoe",
      name: "John Doe",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      username: "janesmith",
      name: "Jane Smith",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 3,
      username: "alexking",
      name: "Alex King",
      avatar: "https://randomuser.me/api/portraits/men/76.jpg",
    },
    {
      id: 4,
      username: "lilyrose",
      name: "Lily Rose",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      id: 5,
      username: "michael88",
      name: "Michael Johnson",
      avatar: "https://randomuser.me/api/portraits/men/54.jpg",
    },
  ]);

  //   useEffect(() => {
  //   const fetchSuggestedUsers = async () => {
  //     try {
  //       const res = await fetch(`${localhost}/users/suggested`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       if (!res.ok) return;
  //       const data = await res.json();
  //       setSuggestedUsers(data);
  //     } catch (err) {
  //       console.error("Error fetching suggested users:", err);
  //     }
  //   };

  //   fetchSuggestedUsers();
  // }, [token]);

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
    setFilteredUsers([]);
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
      {searchText.length === 0 && suggestedUsers.length > 0 && (
        <View style={{ marginTop: 10 }}>
          <Text style={styles.suggestedHeader}>Suggested Users</Text>
          <FlatList
            data={suggestedUsers}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={{
              paddingHorizontal: 15,
              paddingBottom: 20,
            }}
            columnWrapperStyle={{
              justifyContent: "flex-start",
              marginBottom: 15,
            }}
            renderItem={({ item, index }) => {
              const isLastOdd =
                index === suggestedUsers.length - 1 &&
                suggestedUsers.length % 2 !== 0;

              if (isLastOdd) {
                return (
                  <>
                    {/* Actual card */}
                    <View style={{ flex: 1, marginHorizontal: 6 }}>
                      <SuggestedUserCard
                        user={item}
                        onPress={(user) =>
                          navigation.navigate("Profile", { userId: user.id })
                        }
                      />
                    </View>

                    {/* Invisible filler to keep grid aligned */}
                    <View
                      style={{ flex: 1, marginHorizontal: 6, opacity: 0 }}
                    />
                  </>
                );
              }

              return (
                <View style={{ flex: 1, marginHorizontal: 6 }}>
                  <SuggestedUserCard
                    user={item}
                    onPress={(user) =>
                      navigation.navigate("Profile", { userId: user.id })
                    }
                  />
                </View>
              );
            }}
          />
        </View>
      )}

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
  suggestedHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginVertical: 10,
    color: woo_black,
  },
});

export default SearchScreen;
