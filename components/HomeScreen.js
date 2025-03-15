import React, { useState, useEffect } from "react";
("@rneui/themed");
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { db } from "../firebaseConfig";
import ListViewWoos from "./ListViewWoos";
import { woo_black, woo_white, woo_orange } from "../assets/colors";
import { collection, query, where, onSnapshot, or } from "firebase/firestore";
import { Gallery } from "./shared";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome6";
import ListViewStories from "./ListViewStories";
import ListViewPrivateWoos from "./ListViewPrivateWoos";

const HomeScreen = ({ route }) => {
  const { uid } = route.params;

  const [woos, setWoos] = useState([]);
  const [isPrivateVisible, setIsPrivateVisible] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "woos"),
      or(
        where("woo_migos", "array-contains", uid),
        where("migo_woos", "array-contains", uid),
        where("owner_uid", "==", uid)
      )
    );

    const togglePrivateVisible = () => {
      setIsPrivateVisible(!isPrivateVisible);
    };

    const getWoos = onSnapshot(
      q,
      (querySnapshot) => {
        const homeWoos = [];
        querySnapshot.forEach((doc) => {
          homeWoos.push(doc);
        });
        setWoos(homeWoos);
      },
      (error) => {}
    );
    return () => {
      getWoos();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View
          style={{
            marginTop: 20,
          }}
        >
          <ListViewStories gallery={Gallery} />
        </View>

        <View
          style={{
            flexDirection: "row",
            margin: 10,
            marginTop: 30,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              private woos
            </Text>
            {isPrivateVisible ? (
              <FontAwesomeIcon
                name="eye-slash"
                size={20}
                color={woo_black}
                onPress={() => setIsPrivateVisible(!isPrivateVisible)}
              />
            ) : (
              <FontAwesomeIcon
                name="eye"
                size={20}
                color={woo_black}
                onPress={() => setIsPrivateVisible(!isPrivateVisible)}
              />
            )}
            <Text style={styles.text}>1</Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Text style={styles.smallText}>view all</Text>
          </View>
        </View>
        <ListViewPrivateWoos gallery={Gallery} isVisible={isPrivateVisible}/>
        <View
          style={{
            flexDirection: "row",
            margin: 10,
            marginTop: 10,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              public woos
            </Text>
          </View>
          <Text style={styles.smallText}>view all</Text>
        </View>
        <ListViewWoos view={"list"} woos={woos} uid={uid} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: woo_white,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: woo_orange,
  },
  smallText: {
    fontSize: 12,
    fontWeight: "bold",
    color: woo_orange,
  },
});

export default HomeScreen;
