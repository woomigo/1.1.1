import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Header, Icon, Switch } from "@rneui/themed";
import { woo_black, woo_orange, woo_white } from "../assets/colors";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const SettingsScreen = ({ route, navigation }) => {
  const { uid } = route.params;

  const userRef = doc(db, "users", uid);

  const [isPrivate, setIsPrivate] = useState(false);

  const toggleSwitch = async (checked) => {
    setIsPrivate(!checked);
    await updateDoc(userRef, {
      is_private_profile: !checked,
    });
  };

  useEffect(() => {
    const getProfileInfo = onSnapshot(
      userRef,
      (doc) => {
        console.log("Document data:", doc.data());
        // setUser(doc.data());
        setIsPrivate(doc.data().is_private_profile);
      },
      (error) => {},
      []
    );

    return () => {
      getProfileInfo();
    };
  }, [uid]);

  return (
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
              settings
            </Text>
          </View>
        }
        leftContainerStyle={styles.leftComponent}
        centerContainerStyle={styles.centerComponent}
      />
      <View style={styles.bodyContainer}>
        <View style={styles.privateProfileContainer}>
          <Text style={styles.privateProfileText}>private profile:</Text>
          <Switch
            value={isPrivate}
            color={woo_orange}
            onValueChange={(value) => toggleSwitch(!value)}
          />
        </View>
      </View>
    </View>
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
    marginBottom: 5,
  },
  leftComponent: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerComponent: {
    justifyContent: "center",
    alignItems: "center",
  },
  bodyContainer:{
    padding: 20
  },
  privateProfileText:{
    marginBottom: 3,
    fontWeight: 'bold'
  }
});

export default SettingsScreen;
