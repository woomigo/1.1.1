import { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { Header, Icon, Tab, TabView } from "@rneui/themed";
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
// } from "firebase/firestore";
// import { db } from "../firebaseConfig";
import ListViewUsers from "./ListViewUsers";
import { woo_black, woo_orange, woo_red } from "../assets/colors";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import { localhost } from "./utility";

const MigoRequestScreen = ({ navigation, route }) => {
  const { user, token } = route.params;

  const [index, setIndex] = useState(0);
  const [newFRAction, setNewFRAction] = useState(false);
  const [sentRequests, setSentRequests] = useState();
  const [receivedRequests, setReceivedRequests] = useState();

  const fetchSentFollowRequests = async (token) => {
    if (!token) throw new Error("Auth token is missing");
    try {
      const res = await fetch(`${localhost}/follow-requests/outgoing`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch followings");

      const data = await res.json();
      // console.log(
      //   "Sent Follow Requests OBJECT IS ======= " +
      //     JSON.stringify(data.outgoing_requests)
      // );
      setSentRequests(data.outgoing_requests);
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReceivedFollowRequests = async (token) => {
    if (!token) throw new Error("Auth token is missing");
    try {
      const res = await fetch(`${localhost}/follow-requests/incoming`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch followings");

      const data = await res.json();
      // console.log(
      //   "Received Follow Requests OBJECT IS ======= " + JSON.stringify(data)
      // );
      setReceivedRequests(data.incoming_requests);
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // console.log("MRS ", token);
    fetchReceivedFollowRequests(token);
    fetchSentFollowRequests(token);
  }, [token, newFRAction]);

  const fetchCancelFollowRequest = async (sender_id, receiver_id, token) => {
    if (!token) throw new Error("Auth token is missing");
    if (!sender_id) throw new Error("Sender ID is required");
    if (!receiver_id) throw new Error("Receiver ID is required");
    try {
      const res = await fetch(`${localhost}/follow-requests/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sender_id, receiver_id }),
      });

      if (!res.ok) throw new Error("Failed to fetch followings");

      const data = await res.json();
      console.log(
        "CANCEL FOLLOWER Request OBJECT IS ======= " + JSON.stringify(data)
      );
      setNewFRAction(true);
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  const fetchIgnoreFollowRequest = async (request_id, token) => {
    if (!token) throw new Error("Auth token is missing");
    if (!request_id) throw new Error("Request ID is required");
    try {
      const res = await fetch(
        `${localhost}/follow-requests/${request_id}/decline`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to ignore request");

      const data = await res.json();
      console.log(
        "Ignore FOLLOWER Request OBJECT IS ======= " + JSON.stringify(data)
      );
      setNewFRAction(true);
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAcceptFollowRequest = async (request_id, token) => {
    if (!token) throw new Error("Auth token is missing");
    if (!request_id) throw new Error("Request ID is required");
    try {
      const res = await fetch(
        `${localhost}/follow-requests/${request_id}/accept`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to accept request");

      const data = await res.json();
      console.log(
        "Accept FOLLOWER Request OBJECT IS ======= " + JSON.stringify(data)
      );
      setNewFRAction(true);
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (request) => {
    console.log("DELETE " + JSON.stringify(request));
    await fetchCancelFollowRequest(user.id, request.receiver_id, token);
  };

  const handleAccept = async (request) => {
    await fetchAcceptFollowRequest(request.request_id, token);
    console.log("MIGOS MIGO REQUESTS");
    console.log("Accept " + JSON.stringify(request));
  };

  const handleIgnore = async (request) => {
    await fetchIgnoreFollowRequest(request.request_id, token);
    console.log("IGNORE " + JSON.stringify(request));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-start",
          }}
        >
          <Pressable onPress={() => navigation.navigate("Migos")}>
            <FontAwesome6Icon name="chevron-left" size={24} color={woo_black} />
          </Pressable>
        </View>
        <View
          style={{
            flex: 3,
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: woo_black,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            follow requests
          </Text>
        </View>
      </View>

      <Tab
        value={index}
        onChange={(e) => setIndex(e)}
        indicatorStyle={{
          backgroundColor: "#f37320",
          height: 3,
        }}
        containerStyle={{
          marginTop: 30,
          backgroundColor: "white",
        }}
      >
        <Tab.Item
          title="received"
          titleStyle={{ fontSize: 14, color: woo_black }}
        />
        <Tab.Item
          title="sent"
          titleStyle={{ fontSize: 14, color: woo_black }}
        />
      </Tab>
      <TabView value={index} onChange={setIndex} animationType="spring">
        <TabView.Item style={{ width: "100%" }}>
          <View style={styles.tabHeader}>
            <ListViewUsers
              users={receivedRequests}
              onPressUser={(selectedUser) => {
                console.log(
                  "SU 999999999999999999999999999999999999999999 ",
                  selectedUser
                );
                navigation.push("Profile", {
                  userUID: selectedUser.user_id,
                });
              }}
            />
          </View>
        </TabView.Item>
        <TabView.Item style={{ width: "100%" }}>
          <View style={styles.tabHeader}>
            <ListViewUsers
              users={sentRequests}
              onPressUser={(selectedUser) =>
                navigation.push("Profile", {
                  userUID: selectedUser.user_id,
                })
              }
            />
          </View>
        </TabView.Item>
      </TabView>
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
  tabHeader: {
    marginTop: 10,
    padding: 5,
  },
  tabText: {
    fontSize: 18,
    color: woo_black,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default MigoRequestScreen;
