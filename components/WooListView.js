import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Header, Icon, ListItem, LinearProgress, Input } from "@rneui/themed";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  doc,
  arrayRemove,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { woo_black, woo_white } from "../assets/colors";
import ListViewChips from "./ListViewWooList";
import ListViewWooList from "./ListViewWooList";
// import { Chips } from "./shared";

const WooListView = ({ navigation, route }) => {
  const { wooID } = route.params;

  const [wooList, setWooList] = useState();
  useEffect(() => {
    // console.log(`WOOID WOOLIST ==== ${wooID}`);
// 
    // const docWooRef = doc(db, "woos", wooID);
    // const getWooList = onSnapshot(
    //   docWooRef,
    //   (doc) => {
    //     console.log("Document data:", doc.data().woo_list);
    //     setWooList(doc.data().woo_list);
    //   },
    //   (error) => {}
    // );

    // return () => {
    //   if (wooID) {
    //     getWooList();
    //   }
    // };
  }, [wooID]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Header
          containerStyle={styles.header}
          backgroundColor={woo_white}
          leftComponent={
            <Icon
              name="chevron-left"
              type="font-awesome-5"
              color={woo_black}
              size={20}
              onPress={() => navigation.goBack()}
            />
          }
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
                woo list
              </Text>
            </View>
          }
          leftContainerStyle={styles.leftComponent}
          centerContainerStyle={styles.centerComponent}
        />
        <ListViewWooList view={"list"} chips={wooList} />
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

export default WooListView;
