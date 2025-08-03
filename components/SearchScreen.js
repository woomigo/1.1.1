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
} from "react-native";
import { Header, Icon, Input, Avatar, Skeleton } from "@rneui/themed";
import {
  woo_black,
  woo_gray,
  woo_green,
  woo_white,
  woo_orange,
} from "../assets/colors";
import LayoutUserItem from "./LayoutUserItem";
import { db } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  doc,
  arrayRemove,
} from "firebase/firestore";
import { FlatList } from "react-native";
import ListViewUsers from "./ListViewUsers";
import { SelfIdentity } from "./shared";
import { render } from "react-native-web";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import SearchInput from "./SearchInput";

const SearchScreen = ({ navigation, route }) => {
  const { uid } = route.params;

  useEffect(() => {
    console.log(" UID === " + uid);
  }, []);

  // const keyboardVerticalOffset = Platform.OS === 'ios' ? 180 : 0

  const [searchValue, setSearchValue] = useState([]);
  const [user, setUser] = useState();
  const [isSearchError, setIsSearchError] = useState();
  const [isSearchIconHidden, setSearchIconHidden] = useState(true);
  const [isUserExists, setIsUserExists] = useState();
  const [view, setView] = useState("migoSuccess");

  const searchRef = useRef();

  const handleSearchOnFocus = () => {
    setSearchValue();
    setUser();
    setView();
    console.log("FOCUS");
  };

  const handleSearch = async () => {
    console.log("SEARCH");
    setView("none");
    const q = query(
      collection(db, "users"),
      where("username", "==", searchValue.toLowerCase().trim())
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(
      (doc) => {
        setView("follow");
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data().followers);
        setUser(doc.data());
        if (doc.data().followers.includes(uid)) {
          setView("following");
        } else if (doc.data().following.includes(uid)) {
          setView("migoFollow");
        } else if (doc.data().received_migo_requests.includes(uid)) {
          setView("requestSent");
        } else if (doc.data().migos.includes(uid)) {
          setView("migos");
        } else {
          setView("follow");
        }
        console.log("This");
      },
      (error) => {}
    );
    console.log("view is " + view);
    console.log(`user === ${user}`);
    searchRef.current.clear();
    searchRef.current.blur();
  };

  const handleSearchOnChange = (input) => {
    if (input.length > 0) {
      setSearchIconHidden(false);
    } else {
      setSearchIconHidden(true);
    }
    setIsSearchError(false);
    setSearchValue(input);
  };

  const handleOnBlur = () => {
    console.log("BLUR!");
    searchRef.current.blur();
    Keyboard.dismiss();
  };

  const handleSearchEndEditing = () => {
    console.log("END EDITING!!!");
    setSearchIconHidden(true);
  };

  const renderView = (view) => {
    switch (view) {
      case "follow":
        return (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: woo_orange }]}
            onPress={() => handleFollowUser()}
          >
            <Text style={styles.buttonText}>follow</Text>
          </TouchableOpacity>
        );

      case "migoFollow":
        return (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: woo_orange }]}
            onPress={() => handleAddMigo()}
          >
            <Text style={styles.buttonText}>follow</Text>
          </TouchableOpacity>
        );
      case "following":
        return (
          <TouchableOpacity
            disabled
            style={[styles.addButton, { backgroundColor: woo_gray }]}
          >
            <Text style={styles.buttonText}>following</Text>
          </TouchableOpacity>
        );
      case "requestSent":
        return (
          <TouchableOpacity
            disabled
            style={[styles.addButton, { backgroundColor: woo_gray }]}
          >
            <Text style={styles.buttonText}>request sent</Text>
          </TouchableOpacity>
        );
      case "migos":
        return (
          <TouchableOpacity
            disabled
            style={[styles.addButton, { backgroundColor: woo_gray }]}
          >
            <Text style={styles.buttonText}>migos</Text>
          </TouchableOpacity>
        );
      case "loading":
        return (
          <Skeleton
            // LinearGradientComponent={LinearGradient}
            animation="wave"
            width={80}
            height={30}
            borderRadius={10}
          />
        );
      case "success":
        return (
          <TouchableOpacity
            disabled
            style={[styles.addButton, { backgroundColor: woo_green }]}
            onPress={() => handleUserFollowed()}
          >
            <Text style={styles.buttonText}>following!</Text>
          </TouchableOpacity>
        );
      case "migoSuccess":
        return (
          <TouchableOpacity
            disabled
            style={[styles.addButton, { backgroundColor: woo_green }]}
            onPress={() => handleUserFollowed()}
          >
            <Text style={styles.buttonText}>migos!</Text>
          </TouchableOpacity>
        );
      case "successMigoRequest":
        return (
          <TouchableOpacity
            disabled
            style={[styles.addButton, { backgroundColor: woo_green }]}
            onPress={() => handleUserFollowed()}
          >
            <Text style={styles.buttonText}>request sent!</Text>
          </TouchableOpacity>
        );
      default:
        return "";
    }
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

      {/* <SearchInput
        data={wooList}
        onResultsChange={setFilteredResults}
        showEmptyMessage={true}
        placeholder="search woo list"
      /> */}

      <Input
        value={searchValue}
        ref={searchRef}
        onChangeText={(text) => handleSearchOnChange(text)}
        placeholder="search users by @username"
        fontSize={14}
        backgroundColor={woo_white}
        leftIcon={
          <Icon
            style={{ paddingEnd: 5 }}
            type="font-awesome-5"
            name="search"
            size={18}
          />
        }
        // errorStyle={{ color: 'red' }}
        // errorMessage={isSearchError && "sorry we couldn't find that Search"}
        autoCapitalize="none"
        onFocus={() => handleSearchOnFocus()}
        onBlur={() => handleOnBlur()}
        onEndEditing={() => handleSearchEndEditing()}
        rightIcon={
          !isSearchIconHidden && (
            <TouchableOpacity style={{ width: 18, height: 18 }}>
              <Icon
                name="play"
                type="font-awesome-5"
                size={18}
                onPress={() => handleSearch()}
              />
            </TouchableOpacity>
          )
        }
      />

      {user && user ? (
        user.uid === uid ? (
          // searching for self
          <View style={styles.userInfoContainer}>
            <View style={styles.imageContainer}>
              <Avatar
                rounded
                size="medium"
                source={{ uri: `${user.profile_pic_url}` }}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                {
                  SelfIdentity[Math.floor(Math.random() * SelfIdentity.length)]
                    .header
                }
              </Text>
              <Text style={{ fontSize: 12 }}>
                {
                  SelfIdentity[Math.floor(Math.random() * SelfIdentity.length)]
                    .message
                }
              </Text>
            </View>
            {/* <View style={styles.requestButtonContainer}>
                            <TouchableOpacity
                                style={[styles.addButton, { backgroundColor: woo_gray }]}
                                onPress={() => handleFollowUser()}
                            ><Text style={styles.buttonText}>follow</Text>
                            </TouchableOpacity>
                        </View> */}
          </View>
        ) : (
          // searching for user with no error
          <TouchableOpacity
            style={styles.container}
            onPress={() => {
              user.uid !== uid &&
                navigation.navigate("Profile", { userUID: user.uid });
            }}
          >
            <View style={styles.userInfoContainer}>
              <View style={styles.imageContainer}>
                <Avatar
                  rounded
                  size="medium"
                  source={{ uri: `${user.profile_pic_url}` }}
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                  {user.first_name + " " + user.last_name}
                </Text>
                <Text style={{ fontSize: 12 }}>@{user.username}</Text>
              </View>
              <View style={styles.requestButtonContainer}>
                {renderView(view)}
              </View>
            </View>
          </TouchableOpacity>
        )
      ) : view === "none" ? (
        <View style={{ alignItems: "center" }}>
          <Text> no user found </Text>
        </View>
      ) : null}
      {/* </TouchableWithoutFeedback> */}
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
  userInfoContainer: {
    // flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    flexDirection: "row",
    padding: 20,
  },
  imageContainer: {
    flex: 0.4,
    // backgroundColor: 'red'
  },
  textContainer: {
    flex: 1,
    // backgroundColor: 'blue'
  },
  addButton: {
    // backgroundColor: '#f37320',
    padding: 5,
    borderRadius: 10,
    width: 100,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  requestButtonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default SearchScreen;
