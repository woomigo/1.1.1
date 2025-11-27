import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
  SafeAreaView,
} from "react-native";
// import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "../components/Avatar"; // Your avatar component
import { woo_black, woo_white } from "../assets/colors";
import { Header, Icon } from "@rneui/themed";
import SelectableUserListView from "./SelectableUserListView";

const WooMigosScreen = ({ route, navigation }) => {
  const { wooMedia, wooType, user, token } = route.params;

  const localhost = "http://10.0.0.250:3000";

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [followers, setFollowers] = useState([]);

  const fetchUserFollow = async (userId, token) => {
    const res = await fetch(`${localhost}/followers/${userId}/followers-info`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ⬅️ your auth token here
      },
    });

    const data = await res.json();
    console.log("WMS FOLLOWERS ARE ======= " + JSON.stringify(data));
    setFollowers(data.followers);
    setUsername(data.user.username);
    setFirstName(data.user.first_name);
    setLastName(data.user.last_name);
    setProfilePicURL(data.user.profile_pic_url);
    if (!res.ok) throw new Error("Failed to fetch follow counts");
    return res.json();
  };

  const handleSelectedUsers = (users) => {
    setSelectedUsers(users);
    console.log("Selected users:", users); // Optional: debug
  };

  useEffect(() => {
    fetchUserFollow(user.id, token);
  }, [user]);

  return (
    <View style={{ flex: 1, backgroundColor: woo_white }}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={styles.container}
        keyboardVerticalOffset={80}
      >
        <Header
          style={styles.header}
          backgroundColor={"#fff"}
          // leftComponent={
          //   <Icon
          //     name="chevron-left"
          //     type="font-awesome-5"
          //     color={woo_black}
          //     size={25}
          //     onPress={() =>
          //       navigation.navigate("EditMedia", { wooMedia: wooMedia })
          //     }
          //   />
          // }
          centerComponent={
            <View>
              <Text
                style={{
                  fontSize: 25,
                  color: woo_black,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                woo migos
              </Text>
            </View>
          }
          // rightComponent={
          //   <Icon
          //     name="chevron-right"
          //     type="font-awesome-5"
          //     color={woo_black}
          //     size={25}
          //     onPress={() =>
          //       navigation.navigate("WooDate", {
          //         wooMedia: wooMedia,
          //         wooType: wooType,
          //         wooMigos: selectedMigos,
          //         migoWoos: migos,
          //       })
          //     }
          //   />
          // }
          rightContainerStyle={styles.rightComponent}
          leftContainerStyle={styles.leftComponent}
          centerContainerStyle={styles.centerComponent}
        />
        <SelectableUserListView
          users={followers}
          returnSelectedUsers={handleSelectedUsers}
        />
      </KeyboardAvoidingView>
      {/* Navigation Buttons */}
      <View style={styles.navButtons}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("EditMedia", { wooMedia: wooMedia })
          }
          style={styles.button}
        >
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("WooTags", {
              wooMedia: wooMedia,
              wooType: wooType,
              wooMigos: selectedUsers,
            })
          }
          style={styles.button}
        >
          <Icon name="arrow-right" size={24} color="white" />
        </TouchableOpacity>
      </View>
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
  header: {
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.2,
    elevation: 4,
  },
  //   leftComponent: {
  //     justifyContent: "center",
  //     alignItems: "center",
  //   },
  centerComponent: {
    justifyContent: "center",
    alignItems: "center",
  },
  //   rightComponent: {
  //     justifyContent: "center",
  //     alignItems: "center",
  //   },
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
  navButtons: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 30,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default WooMigosScreen;

// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Pressable,
//   TouchableOpacity,
//   TextInput,
//   FlatList,
// } from "react-native";
// import { Avatar, Header, Icon, LinearProgress } from "@rneui/themed";
// import { woo_black, woo_orange } from "../assets/colors";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   updateDoc,
//   arrayUnion,
//   doc,
//   arrayRemove,
//   onSnapshot,
//   serverTimestamp,
// } from "firebase/firestore";
// import { db } from "../firebaseConfig";
// import { Migos } from "./shared";
// import ListViewUsers from "./ListViewUsers";
// import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";

// const WooMigosScreen = ({ route, navigation }) => {
//   const { wooMedia, wooType, uid } = route.params;

//   const [migos, setMigos] = useState([]);
//   const [search, setSearch] = useState("");
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [selectedMigos, setSelectedMigos] = useState([]);

//   // const returnMigosSelected = (migoList) => {
//   //     console.log("WMS ===> " + migoList)
//   //     setSelectedMigos(migoList)
//   // }

//   useEffect(() => {
//     const docRef = doc(db, "users", uid);
//     const getMigos = onSnapshot(
//       docRef,
//       (doc) => {
//         // console.log("Document data:", doc.data());
//         // setUser(doc.data())
//         // setFollowing(doc.data().following)
//         // setFollowers(doc.data().followers)
//         setMigos(doc.data().followers);
//       },
//       (error) => {}
//     );

//     return () => {
//       getMigos();
//     };
//   }, []);

//   const filteredUsers =
//   followerProfiles.filter(
//     (user) =>
//       user.name.toLowerCase().includes(search.toLowerCase()) &&
//       !selectedUsers.some((u) => u.id === user.id)
//   );

//   return (
//     <View style={styles.container}>
//       <Header
//         style={styles.header}
//         backgroundColor={"#fff"}
//         // leftComponent={
//         //   <Icon
//         //     name="chevron-left"
//         //     type="font-awesome-5"
//         //     color={woo_black}
//         //     size={25}
//         //     onPress={() =>
//         //       navigation.navigate("EditMedia", { wooMedia: wooMedia })
//         //     }
//         //   />
//         // }
//         centerComponent={
//           <View>
//             <Text
//               style={{
//                 fontSize: 25,
//                 color: woo_black,
//                 textAlign: "center",
//                 fontWeight: "bold",
//               }}
//             >
//               woo migos
//             </Text>
//           </View>
//         }
//         // rightComponent={
//         //   <Icon
//         //     name="chevron-right"
//         //     type="font-awesome-5"
//         //     color={woo_black}
//         //     size={25}
//         //     onPress={() =>
//         //       navigation.navigate("WooDate", {
//         //         wooMedia: wooMedia,
//         //         wooType: wooType,
//         //         wooMigos: selectedMigos,
//         //         migoWoos: migos,
//         //       })
//         //     }
//         //   />
//         // }
//         rightContainerStyle={styles.rightComponent}
//         leftContainerStyle={styles.leftComponent}
//         centerContainerStyle={styles.centerComponent}
//       />
//       {/* <LinearProgress
//                 style={{}}
//                 value={.17}
//                 color={woo_orange}
//                 variant="determinate"
//             /> */}

//       <View style={styles.header}>
//         <View
//           style={{
//             //   backgroundColor: "blue",
//             flex: 1,
//             flexDirection: "row",
//             alignItems: "center",
//             justifyContent: "flex-start",
//           }}
//         >
//           <Pressable onPress={() => navigation.goBack()}>
//             <FontAwesome6Icon
//               name="chevron-left"
//               size={24}
//               color={woo_black}
//               style={{ marginEnd: 10 }}
//             />
//           </Pressable>
//           {/* Selected users */}
//           <View style={styles.avatarRow}>
//             {selectedUsers.slice(0, 5).map((user, index) => (
//               <View
//                 key={user.id}
//                 style={[styles.avatarWrapper, index !== 0 && styles.overlap]}
//               >
//                 <Avatar name={user.name} image={user.profilePicUrl} size={36} />
//               </View>
//             ))}

//             {selectedUsers.length > 5 && (
//               <View style={[styles.avatarWrapper, styles.overlap]}>
//                 <View style={styles.extraAvatar}>
//                   <Text style={styles.extraText}>
//                     +{selectedUsers.length - 5}
//                   </Text>
//                 </View>
//               </View>
//             )}

//             {selectedUsers.length > 0 && (
//               <TouchableOpacity
//                 onPress={() => setShowAllUsers(true)}
//                 style={styles.managePill}
//               >
//                 <Ionicons name="people-outline" size={14} color="#007BFF" />
//                 <Text style={styles.manageText}>Manage</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>
//       </View>
//       <TextInput
//           placeholder="Search users..."
//           style={styles.input}
//           value={search}
//           onChangeText={setSearch}
//         />

//         <FlatList
//           data={filteredUsers}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               style={styles.userItem}
//               onPress={() => toggleUserSelect(item)}
//             >
//               <Avatar name={item.name} image={item.profilePicUrl} size={36} />
//               <Text style={styles.userName}>{item.name}</Text>
//               <Ionicons
//                 name="add-circle-outline"
//                 size={20}
//                 color="#007BFF"
//                 style={{ marginLeft: "auto" }}
//               />
//             </TouchableOpacity>
//           )}
//           //   style={{ maxHeight: 150 }}
//         />
//       {/* <ListViewUsers users={migos} returnUsers={returnMigosSelected} hideSearchBar searchBoxPlaceholder="search migos" kind="checkbox" /> */}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   profileInfo: {
//     textAlign: "center",
//   },
//   header: {
//     shadowColor: "#000",
//     shadowOffset: { width: 1, height: 3 },
//     shadowOpacity: 0.2,
//     elevation: 4,
//   },
//   leftComponent: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   centerComponent: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   rightComponent: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

// export default WooMigosScreen;
