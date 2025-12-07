import { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  SafeAreaView,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Icon, Input } from "@rneui/themed";
import { woo_black } from "../assets/colors";
import debounce from "lodash.debounce";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import ListViewUsers from "./ListViewUsers";
import { AuthContext } from "../context/AuthContext";
import { localhost } from "./utility";
import SuggestedUserCard from "./SuggestedUserCard";
import FollowButton from "./FollowButton";

const SearchScreen = ({ navigation, route }) => {
  const { token } = useContext(AuthContext);

  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([
    {
      user_id: "1fb40ece-9bd3-11f0-907e-a841f4a444ea",
      username: "johndoe",
      name: "John Doe",
      profile_pic_url: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      user_id: "1fb412ad-9bd3-11f0-907e-a841f4a444ea",
      username: "janesmith",
      name: "Jane Smith",
      profile_pic_url: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      user_id: "1fb41ba8-9bd3-11f0-907e-a841f4a444ea",
      username: "alexking",
      name: "Alex King",
      profile_pic_url: "https://randomuser.me/api/portraits/men/76.jpg",
    },
    // {
    //   user_id: 4,
    //   username: "lilyrose",
    //   name: "Lily Rose",
    //   profile_pic_url: "https://randomuser.me/api/portraits/women/65.jpg",
    // },
    // {
    //   user_id: 5,
    //   username: "michael88",
    //   name: "Michael Johnson",
    //   profile_pic_url: "https://randomuser.me/api/portraits/men/54.jpg",
    // },
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

  const debouncedFetchUsers = useRef(debounce(fetchFilteredUsers, 300)).current;

  const handleSearch = (text) => {
    setSearchText(text);
    debouncedFetchUsers(text.trim());
  };

  useEffect(() => {
    return () => {
      debouncedFetchUsers.cancel();
    };
  }, []);

  const clearSearch = () => {
    setSearchText("");
    setFilteredUsers([]);
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View
          style={{
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
          {searchText.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearIcon}>
              <Ionicons name="close-circle" size={20} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {searchText.length === 0 && suggestedUsers.length > 0 && (
        <View style={{ marginTop: 10 }}>
          <Text style={styles.suggestedHeader}>Suggested Users</Text>
          <FlatList
            data={suggestedUsers}
            keyExtractor={(item) => item.user_id.toString()}
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
                    <View style={{ flex: 1, marginHorizontal: 6 }}>
                      <SuggestedUserCard
                        isRow={false}
                        footer={<FollowButton profileId={item.user_id} />}
                        user={item}
                        onPress={(user) =>
                          navigation.navigate("Profile", {
                            userId: user.user_id,
                          })
                        }
                      />
                    </View>
                    <View
                      style={{ flex: 1, marginHorizontal: 6, opacity: 0 }}
                    />
                  </>
                );
              }
              return (
                <View style={{ flex: 1, marginHorizontal: 6 }}>
                  <SuggestedUserCard
                    isRow={false}
                    footer={<FollowButton profileId={item.user_id} />}
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
