import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Avatar, CheckBox } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { db } from "../firebaseConfig";
import { doc, docSnap, onSnapshot } from "firebase/firestore";

const LayoutUserItem = ({
  uid,
  onCheckBoxSelected,
  kind,
  singleBtnText,
  doubleBtn1Text,
  doubleBtn2Text,
  singleBtnColor,
  doubleBtn1Color,
  doubleBtn2Color,
  handleSingleBtnOnClick,
  handleDoubleBtnOneOnClick,
  handleDoubleBtnTwoOnClick,
}) => {
  const [selected, setSelected] = useState(false);
  const [user, setUser] = useState();

  useEffect(() => {
    // console.log(`LUI USER === ${JSON.stringify(uid.item)}`)
    if (uid) {
      const getUserInfo = onSnapshot(doc(db, "users", uid.item), (doc) => {
        // console.log("Document data:", doc.data());
        setUser(doc.data());
      });

      return () => {
        getUserInfo();
      };
    }
  }, [uid]);

  const navigation = useNavigation();

  const renderBoxButton = (user) => {
    switch (kind) {
      case "checkbox":
        return (
          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={selected}
              onPress={() => handleClick()}
              style={styles.checkbox}
              checkedColor={"#f37320"}
            />
          </View>
        );
      case "single":
        return (
          <View style={styles.requestButtonContainer}>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: singleBtnColor }]}
              onPress={() => handleSingleBtnOnClick(user)}
            >
              <Text style={styles.buttonText}>{singleBtnText}</Text>
            </TouchableOpacity>
          </View>
        );
      case "double":
        return (
          <View style={styles.requestsButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.acceptButton,
                { backgroundColor: doubleBtn1Color },
              ]}
              onPress={() => handleDoubleBtnOneOnClick(user)}
            >
              <Text style={styles.buttonText}>{doubleBtn1Text}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.denyButton, { backgroundColor: doubleBtn2Color }]}
              onPress={() => handleDoubleBtnTwoOnClick(user)}
            >
              <Text style={styles.buttonText}>{doubleBtn2Text}</Text>
            </TouchableOpacity>
          </View>
        );
      case "selectable":
      default:
        return null;
    }
  };

  const handleClick = () => {
    setSelected(!selected);
    onCheckBoxSelected(user.uid);
    console.log("LUI HC === " + user.uid);
  };

  // const handleCheck = (event) => {
  // console.log("EV ---- " + event.target)
  // var selected_array = [...selected];
  // if (event.target.checked) {
  //     selected_array = [...selected, event.target.value];
  // } else {
  //     selected_array.splice(selected.indexOf(event.target.value), 1);
  // }
  // setSelected(selected_array);
  // };

  return (
    <View>
      {user && (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.container}
            onPress={() => {
              user.uid !== uid && navigation.navigate("User", { user: user });
            }}
          >
            <View style={styles.imageContainer}>
              <Avatar
                rounded
                size="medium"
                source={{ uri: `${user.profile_pic_url}` }}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                {user.first_name + " " + user.last_name}
              </Text>
              <Text style={{ fontSize: 12 }}>@{user.username}</Text>
            </View>
          </TouchableOpacity>

          {renderBoxButton(user)}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 8,
    backgroundColor: "#fff",
    alignItems: "center",
    flexDirection: "row",
    padding: 15,
  },
  imageContainer: {
    flex: 2,
  },
  textContainer: {
    flex: 6,
  },
  checkboxContainer: {
    flex: 1,
  },
  checkbox: {
    height: 15,
    width: 15,
    alignSelf: "center",
  },
  requestsButtonsContainer: {
    flex: 5,
    flexDirection: "row",
  },
  acceptButton: {
    backgroundColor: "green",
    padding: 5,
    borderRadius: 10,
    marginEnd: 15,
    width: 60,
  },
  denyButton: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 10,
    width: 60,
  },
  addButton: {
    backgroundColor: "#f37320",
    padding: 5,
    borderRadius: 10,
    width: 80,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  requestButtonContainer: {
    flex: 3,
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default LayoutUserItem;
