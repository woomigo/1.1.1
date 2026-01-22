import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  Alert,
  StyleSheet,
  Button,
  TextInput,
} from "react-native";
import {
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  getDocs,
  collection,
  arrayUnion,
} from "firebase/firestore";
import Avatar from "./Avatar";
import { db, auth } from "../firebaseConfig";
import ListViewUsers from "./ListViewUsers";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import { woo_black, woo_white } from "../assets/colors";

const ParticipantsScreen = ({ route, navigation }) => {
  const { participants, uid, chatOwner } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View
          style={{
            // backgroundColor: "blue",
            flex: 1,
            height: "100%",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Pressable onPress={() => navigation.goBack()}>
            <FontAwesome6Icon name="chevron-left" size={24} color={woo_black} />
          </Pressable>
        </View>
        <View
          style={{
            // backgroundColor: "red",
            flex: 5,
            flexDirection: "row",
            height: "100%",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: woo_black,
              paddingBottom: 3,
              fontWeight: "bold",
            }}
          >
            participants
          </Text>
        </View>
      </View>

      <ListViewUsers
        uid={uid}
        users={participants}
        showSearch
        onPressUser={(selectedUser) =>
          navigation.navigate("Profile", { userUID: selectedUser.user_id })
        }
      />
    </View>
  );
};

export default ParticipantsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
    backgroundColor: "#fff",
  },
    header: {
      height: 75,
      alignItems: "flex-end",
      flexDirection: "row",
      paddingHorizontal: 20,
    },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
  },
});
