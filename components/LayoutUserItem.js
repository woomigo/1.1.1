import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Pressable } from "react-native";
import { Avatar, CheckBox } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import { woo_black } from "../assets/colors";
// import { db } from "../firebaseConfig";
// import { doc, docSnap, onSnapshot } from "firebase/firestore";

const LayoutUserItem = ({
  userItem,
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
  handleXOnClick,
  handleDoubleBtnOneOnClick,
  handleDoubleBtnTwoOnClick,
}) => {
  const [selected, setSelected] = useState(false);
  // const [user, setUser] = useState();

  useEffect(() => {
    console.log(`LUI USER === ${JSON.stringify(userItem.item)}`);
  }, [userItem]);

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
      case "x":
        return (
          <Pressable style={{marginEnd: 30}} onPress={() => handleXOnClick(userItem.item)}>
            <FontAwesome6Icon name="xmark" solid size={20} color={woo_black}  />
          </Pressable>
        );
      case "single":
        return (
          <View style={styles.requestButtonContainer}>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: singleBtnColor }]}
              onPress={() => handleSingleBtnOnClick(userItem.item)}
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
              onPress={() => handleDoubleBtnOneOnClick(userItem.item)}
            >
              <Text style={styles.buttonText}>{doubleBtn1Text}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.denyButton, { backgroundColor: doubleBtn2Color }]}
              onPress={() => handleDoubleBtnTwoOnClick(userItem.item)}
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
    onCheckBoxSelected(userItem.item.user_id);
    console.log("LUI HC === " + userItem.item.user_id);
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
      {userItem && (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.container}
            onPress={() => {
              console.log();
              userItem.item.user_id !== uid &&
                navigation.push("Profile", { userUID: userItem.item.user_id });
            }}
          >
            <View style={styles.imageContainer}>
              <Avatar
                rounded
                size="medium"
                source={{ uri: `${userItem.item.profile_pic_url}` }}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                {userItem.item.first_name + " " + userItem.item.last_name}
              </Text>
              <Text style={{ fontSize: 12 }}>@{userItem.item.username}</Text>
            </View>
          </TouchableOpacity>

          {renderBoxButton(userItem)}
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
