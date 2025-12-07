import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
} from "react-native";
import { Avatar, Icon } from "@rneui/themed";
import {
  woo_black,
  woo_gray,
  woo_light_gray,
  woo_orange,
  woo_white,
} from "../assets/colors";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
// import { Swipeable } from 'react-native-gesture-handler';

const LayoutNotificationItem = ({ notification }) => {
  const navigation = useNavigation();

  const [username, setUsername] = useState();
  const [setNotificationID, notificationID] = useState();
  const [lastName, setLastName] = useState();
  const [profilePicURL, setProfilePicURL] = useState();

  useEffect(() => {
    // setNotificationID(notification.item.id)
    // console.log("LNI ---- " + notification.item.id);

    const docRef = doc(db, "users", notification.item.data().owner_uid);
    const getProfileInfo = onSnapshot(
      docRef,
      (doc) => {
        // console.log("Document data:", doc.data());
        setUsername(doc.data().username);
        setProfilePicURL(doc.data().profile_pic_url);
      },
      (error) => {}
    );

    return () => {
      getProfileInfo();
    };
  }, []);

  const confirmDeleteAlert = () =>
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => console.log("Delete Pressed"),
          style: "destructive",
        },
      ]
    );

  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });

    return (
      <View>
        <TouchableOpacity
          style={styles.deleteTouchable}
          onPress={confirmDeleteAlert}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // notification types
  // woo
  // message
  // migo request received
  // migo request accepted
  // migo
  // follower
  // woo like
  // woo comment
  // update woo date
  // update woo time
  // update woo location
  // add woo media gallery

  const renderIcon = (type) => {
    switch (type) {
      case "woo":
        return (
          <Image
            style={{ width: 30, height: 24 }}
            source={require("../assets/woomigo_icon.png")}
          />
        );
      case "woo like":
        return (
          <Icon
            name="heart"
            type="font-awesome-5"
            solid={true}
            color={woo_orange}
            size={25}
          />
        );
      case "woo gallery":
        return (
          <Icon
            name="photo-video"
            type="font-awesome-5"
            solid={true}
            color={woo_black}
            size={25}
          />
        );
      case "update woo time":
        return (
          <Icon
            name="clock"
            type="font-awesome-5"
            solid={true}
            color={woo_black}
            size={25}
          />
        );
      case "update woo date":
        return (
          <Icon
            name="calendar"
            type="font-awesome-5"
            solid={true}
            color={woo_black}
            size={25}
          />
        );
      case "update woo location":
        return (
          <Icon
            name="map-marker-alt"
            type="font-awesome-5"
            solid={true}
            color={woo_black}
            size={25}
          />
        );
      case "message":
        return (
          <Icon
            name="envelope"
            type="font-awesome-5"
            solid={true}
            color={woo_black}
            size={25}
          />
        );
      case "migo request received":
        return (
          <Icon
            name="user-plus"
            type="font-awesome-5"
            solid={true}
            color={woo_black}
            size={25}
          />
        );
      case "migo request accepted":
        return (
          <Icon
            name="user-check"
            type="font-awesome-5"
            solid={true}
            color={woo_black}
            size={25}
          />
        );
      case "woo comment":
        return (
          <Icon
            name="comment"
            type="font-awesome-5"
            solid={true}
            color={woo_black}
            size={25}
          />
        );
      default:
        return (
          <Icon
            name="bell"
            type="font-awesome-5"
            solid={true}
            color={woo_orange}
            size={25}
          />
        );
    }
  };

  const renderMessage = (type) => {
    switch (type) {
      case "woo":
        return <Text style={styles.notification}>sent a woo!</Text>;
      case "woo like":
        return <Text style={styles.notification}>liked your woo!</Text>;
      case "woo gallery":
        return <Text style={styles.notification}>added to a woo gallery</Text>;
      case "update woo time":
        return (
          <Text style={styles.notification}>updated the time to a woo</Text>
        );
      case "update woo date":
        return (
          <Text style={styles.notification}>updated the date to a woo</Text>
        );
      case "update woo location":
        return (
          <Text style={styles.notification}>updated the location to a woo</Text>
        );
      case "woo comment":
        return <Text style={styles.notification}>commented on your woo</Text>;
      case "message":
        return <Text style={styles.notification}>sent a message</Text>;
      case "migo request received":
        return (
          <Text style={styles.notification}>sent you a follow request</Text>
        );
      case "migo request accepted":
        return (
          <Text style={styles.notification}>accepted your follow request</Text>
        );
      default:
        return <Text style={styles.notification}>notification error</Text>;
    }
  };

  const navigationOnClick = (type) => {
    switch (type) {
      case "woo like":
        return navigation.navigate("WooView", {
          wooID: notification.item.data().woo_id,
        });
      default:
        return (
          <Icon
            name="bell"
            type="font-awesome-5"
            solid={true}
            color={woo_orange}
            size={25}
          />
        );
    }
  };

  return (
    // <Swipeable style={styles.swipeRow} renderRightActions={renderRightActions} >
    <View>
      <TouchableOpacity
        onPress={() =>
          navigationOnClick(notification.item.data().notification_type)
        }
        style={[
          styles.container,
          !notification.item.data().is_read && {
            backgroundColor: woo_light_gray,
          },
        ]}
      >
        <View
          style={{
            // backgroundColor: "blue",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={styles.avatarContainer}>
            <Avatar rounded size="small" source={{ uri: `${profilePicURL}` }} />
          </View>
          <View style={styles.notificationContainer}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.username}>{`@${username}`} </Text>
            </View>
            <View style={styles.notification}>
              {renderMessage(notification.item.data().notification_type)}
            </View>
            <Text style={styles.time}>{notification.item.data().time_ago}</Text>
            {/* <Text style={styles.time}>
              {new Date(
                notification.item.data().timestamp * 1000
              ).toLocaleTimeString()}
            </Text> */}
          </View>
        </View>
        <View style={styles.spaceContainer}>
          <Text></Text>
        </View>

        <View
          style={[
            styles.iconContainer,
            notification.item.data().notification_type ==
              "migo request received" ||
            notification.item.data().notification_type ==
              "migo request accepted" ||
            notification.item.data().notification_type == "woo gallery"
              ? { marginEnd: 12 }
              : { marginEnd: 18 },
          ]}
        >
          {renderIcon(notification.item.data().notification_type)}
        </View>
      </TouchableOpacity>
    </View>

    // </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    // backgroundColor: 'red',
    // justifyContent: "space-evenly",
    padding: 15,
  },
  avatarContainer: {
    marginStart: 5,
  },
  spaceContainer: {
    // backgroundColor: "green",
    flex: 1,
    alignItems: "flex-end",
  },
  iconContainer: {
    // backgroundColor: "yellow",
    flex: 1,
    alignItems: "flex-end",
  },
  notificationContainer: {
    marginStart: 5,
  },
  username: {
    fontWeight: "bold",
  },
  notification: {
    fontSize: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  time: {
    fontSize: 10,
  },
  deleteView: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
  },
  deleteTouchable: {
    backgroundColor: "red",
    height: "100%",
    justifyContent: "center",
  },
  deleteText: {
    color: "white",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 16,
    width: 100,
  },
});

export default LayoutNotificationItem;
