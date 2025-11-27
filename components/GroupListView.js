import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Header, Icon, ListItem, LinearProgress, Input } from "@rneui/themed";

import { woo_black, woo_white } from "../assets/colors";
import ListViewGroupList from "./ListViewGroupList";

const GroupListView = ({ navigation, route, userId, token }) => {
  //   const { userId, token } = route.params;

  useEffect(() => {
    fetchGroups(userId, token);
  }, [userId]);

  const localhost = "http://10.0.0.250:3000";

  const [groups, setGroups] = useState();

  const fetchGroups = async (userId, token) => {
    const res = await fetch(`${localhost}/groups/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ⬅️ your auth token here
      },
    });

    const data = await res.json();
    console.log("GROUPS ARE ======= " + JSON.stringify(data));
    setGroups(data);
    if (!res.ok) throw new Error("Failed to fetch groups");
    return res.json();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <ListViewGroupList groups={groups} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: woo_white,
  },
  header: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
    marginBottom: 20,
  },
  leftComponent: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerComponent: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default GroupListView;
