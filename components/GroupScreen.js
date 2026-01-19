import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import { woo_black, woo_white } from "../assets/colors";
import { useEffect, useState } from "react";
import Avatar from "./Avatar";
import { getTimeAgo, localhost } from "./utility";
import ListViewUsers from "./ListViewUsers";
import { EmailAuthCredential } from "firebase/auth/web-extension";

const GroupScreen = ({ navigation, route, token }) => {
  const [members, setMembers] = useState();
  const { group } = route.params;
  useEffect(() => {
    console.log("GS: ", group);
  });

  useEffect(() => {
    fetchGroupMembers(group.id, token);
  }, [group]);

  const fetchGroupMembers = async (groupId, token) => {
    const res = await fetch(`${localhost}/group-members/${groupId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
        console.log("GROUPS ARE ======= " + JSON.stringify(data));
    setMembers(data);
    if (!res.ok) throw new Error("Failed to fetch groups");
    return res.json();
  };
  return (
    <SafeAreaView style={styles.container}>
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
          <Pressable onPress={() => navigation.navigate("MigoGroups")}>
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
          <Avatar size={40} image={group.profile_pic_url} name={group.name} />
          <View
            style={{
              //   backgroundColor: "yellow",
              flex: 5,
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
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
              {group.name}
            </Text>
            <Text style={{ fontSize: 12 }}>users: {group.member_count}</Text>
            <Text style={{ fontSize: 12 }}>
              created: {getTimeAgo(group.created_at)}
            </Text>
          </View>

          {/* <MigosAvatarGroup maxAvatars={3} migos={group.member_profile_pics} /> */}
        </View>
        <View
          style={{
            flex: 2,
            flexDirection: "row",
            justifyContent: "space-around",
            height: "100%",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flex: 1,

              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <Pressable onPress={() => navigation.navigate("CreateEditGroup", {group: group, members: members})}>
              <FontAwesome6Icon name="users-gear" size={26} color={woo_black} />
            </Pressable>
            
          </View>
        </View>
      </View>
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <Text style={{ fontSize: 14, marginTop: 10 }}>
            {group.description}
          </Text>
        </View>
      </View>
      <ListViewUsers
        users={members}
        onPressUser={(selectedUser) =>
          navigation.push("Profile", { userUID: selectedUser.user_id })
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: woo_white,
  },
  header: {
    height: 75,
    alignItems: "flex-end",
    flexDirection: "row",
    paddingHorizontal: 20,
  },
});

export default GroupScreen;
