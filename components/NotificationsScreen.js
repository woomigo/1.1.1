import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View, Platform, Alert, SafeAreaView } from "react-native";
import { Header, Icon, Dialog } from "@rneui/themed";
import { Notifications } from "./shared";
import ListViewNotifications from "./ListViewNotifications";
import { woo_black, woo_white } from "../assets/colors";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
  or,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";

// notification types
// woo
// message
// migo request received
// migo request accepted
// migo
// follower
// woo like
// woo comment

const NotificationsScreen = ({ navigation, route }) => {
  // const {uid} = route.params;

  const [isNewNotification, setIsNewNotification] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // console.log("Anything " + uid)
    const q = query(
      collection(db, "notifications"),
      where("receiver_uid", "array-contains", "UX7oplUvf8VD6XVD1ScuaRy4JOg2")
    );
    const getNotifications = onSnapshot(
      q,
      (querySnapshot) => {
        const notificationsData = [];
        querySnapshot.forEach((doc) => {
          console.log("Notifications: " + JSON.stringify(doc.data()));
          notificationsData.push(doc);
        });
        setNotifications(notificationsData);
      },
      (error) => {}
    );

    return () => {
      getNotifications();
    };
  }, []);

  const clearNotifications = () => {
    // setIsNewNotification(false)
  };

  const confirmClearNotifications = () =>
    Alert.alert(
      "mark all unread",
      "are you sure you want to mark all unread notifications as read?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            console.log("Clear Pressed");
            clearNotifications();
          },
        },
      ]
    );

  return (
    <SafeAreaView style={styles.container}>
      {/* <Header
                containerStyle={styles.header}
                backgroundColor={'#fff'}

                // leftComponent={
                    
                // }
                centerComponent={
                    <View >
                        <Text style={{ fontSize: 25, color: {woo_black}, textAlign: 'center', fontWeight: 'bold' }}>notifications</Text>
                    </View>
                }
                rightComponent={

                    <Icon
                        name="bell"
                        type='font-awesome-5'
                        solid={isNewNotification}
                        color={woo_black}
                        size={25 }
                        onPress={confirmClearNotifications}
                    />
                }
                rightContainerStyle={styles.rightComponent}
                leftContainerStyle={styles.leftComponent}
                centerContainerStyle={styles.centerComponent}
            /> */}

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
            notifications
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
            name="bell"
            size={26}
            color={woo_black}
          />
          <FontAwesome6Icon
            name="ellipsis"
            size={26}
            color={woo_black}
          />
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

      <ListViewNotifications notifications={notifications} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaViewStyle: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: woo_white,
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
});

export default NotificationsScreen;
