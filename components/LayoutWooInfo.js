import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Linking,
} from "react-native";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Icon, Avatar, Card } from "@rneui/themed";
import { woo_gray, woo_black, woo_orange, woo_white } from "../assets/colors";
import { useNavigation } from "@react-navigation/native";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import { getMonthAndDay } from "./utility";

const LayoutWooInfo = ({
  uid,
  wooType,
  ownerUID,
  wooMigos,
  wooDate,
  wooTime,
  wooLocation,
  sharedProfilePic,
}) => {
  const navigation = useNavigation();

  const { month, day } = getMonthAndDay(wooDate);

  const [user, setUser] = useState();
  const [username, setUsername] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [profilePicURL, setProfilePicURL] = useState();

  const WooMigoImage = ({ userID }) => {
    const [profilePicURL, setProfilePicURL] = useState();

    useEffect(() => {
      const docRef = doc(db, "users", userID);
      const getProfileInfo = onSnapshot(
        docRef,
        (doc) => {
          // console.log("Document data:", doc.data());
          setProfilePicURL(doc.data().profile_pic_url);
        },
        (error) => {}
      );

      return () => {
        getProfileInfo();
      };
    }, []);

    return (
      <Image style={styles.wooMigoImage} source={{ uri: profilePicURL }} />
    );
  };

  useEffect(() => {
    console.log();
    const docRef = doc(db, "users", ownerUID);
    const getProfileInfo = onSnapshot(
      docRef,
      (doc) => {
        // console.log("Document data:", doc.data());
        setUser(doc.data());
        setUsername(doc.data().username);
        setFirstName(doc.data().first_name);
        setLastName(doc.data().last_name);
        setProfilePicURL(doc.data().profile_pic_url);
      },
      (error) => {}
    );

    return () => {
      getProfileInfo();
    };
  }, []);

  const openCal = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("calshow:");
    } else if (Platform.OS === "android") {
      Linking.openURL("content://com.android.calendar/time/");
    }
  };

  return (
    <Card containerStyle={styles.container}>
      <View style={styles.nameDateContainer}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-end" }}>
          <TouchableWithoutFeedback>
            <Avatar rounded size="medium" source={{ uri: profilePicURL }} />
          </TouchableWithoutFeedback>
          <View style={{ justifyContent: "flex-end" }}>
            <TouchableWithoutFeedback
              onPress={() => {
                user.uid !== uid && navigation.push("Profile", { userUID: user.uid });
              }}
            >
              <View style={{ marginStart: 5 }}>
                <Text style={styles.wooOwnerText}>{firstName}</Text>
                <Text style={styles.wooOwnerText}>{lastName}</Text>
                <Text style={styles.wooOwnerUsernameText}>@{username}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>

        <View style={styles.dateContainer}>
          <View style={{ flex: 8 }}></View>
          <View style={styles.date}>
            <Text style={styles.dateText}>{month}</Text>
            <Text style={styles.dateText}>{day}</Text>
          </View>
        </View>
      </View>
      <View style={styles.timeLocationMigosContainer}>
        <View style={styles.timeLocationContainer}>
          <View style={styles.timeContainer}>
            <FontAwesome6Icon
              name="clock"
              size={16}
              color={woo_black}
              onPress={() => setIsPrivateVisible(!isPrivateVisible)}
            />
            <Text style={styles.wooTimeLocationText}>{wooTime}</Text>
          </View>
          <View style={styles.locationContainer}>
            <FontAwesome6Icon
              name="location-dot"
              size={16}
              color={woo_black}
              onPress={() => setIsPrivateVisible(!isPrivateVisible)}
            />
            <Text style={styles.wooTimeLocationText}>{wooLocation.address}</Text>
          </View>
        </View>
        <View style={styles.migosContainer}>
          <View style={styles.wooMigosImagesContainer}>
            {wooMigos.length > 0 && <WooMigoImage userID={wooMigos[0]} />}
            {wooMigos.length > 1 && <WooMigoImage userID={wooMigos[1]} />}
            {wooMigos.length > 2 && <WooMigoImage userID={wooMigos[2]} />}
            {wooMigos.length > 3 && <WooMigoImage userID={wooMigos[3]} />}
            {wooMigos.length > 4 && <View style={[styles.wooMigoImage, {backgroundColor: woo_orange, justifyContent: 'center', alignItems: 'center'}]}><Text style={{color: woo_white, fontSize: 12}}>+{wooMigos.length - 4}</Text></View>}
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 5,
    margin: 10,
    padding: 10,
  },
  nameDateContainer: {
    flex: 1,
    flexDirection: "row",
  },
  timeLocationMigosContainer: {
    flex: 1,
    flexDirection: "row",
    padding: 10
  },
  wooOwnerText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  wooOwnerUsernameText: {
    fontSize: 12,
  },
  dateContainer: {
    flex: 1,
    marginStart: 5,
    flexDirection: "row",
    justifyContent: "center",
    // backgroundColor: "green",
  },
  date: {
    flex: 3,
    backgroundColor: woo_orange,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    color: woo_white,
  },
  timeLocationContainer: {
    flex: 1,
    marginStart: 5
  },
  timeContainer: {
    flexDirection: "row",
    margin: 2
  },
  locationContainer: {
    flexDirection: "row",
    margin: 3
  },
  wooTimeLocationText: {
    marginStart: 5,
    fontSize: 12
  },
  migosContainer: {
    flex: 1,
  },
  migosContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  wooMigosImagesContainer: {
    flexDirection: "row",
  },
  wooMigoImage: {
    backgroundColor: "#d9d9d9",
    width: 35,
    height: 35,
    borderRadius: 18,
    marginEnd: -10
  },
});

export default LayoutWooInfo;
