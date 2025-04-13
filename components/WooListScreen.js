import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  FlatList,
} from "react-native";
import { Header, Icon, LinearProgress, Input, Button } from "@rneui/themed";
import { woo_black, woo_orange } from "../assets/colors";
import ListViewChips from "./ListViewWooList";
import SelectableInputCounter from "./SelectableInputCounter";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";

const WooListScreen = ({ route, navigation }) => {
  const {
    wooMedia,
    wooType,
    wooMigos,
    migoWoos,
    wooDate,
    wooTime,
    wooLocation,
  } = route.params;

  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");

  useEffect(() => {
    console.log("ITEMS: ==== " + JSON.stringify(items));
  });

  // Add a new item to the list
  const addItem = () => {
    if (itemName) {
      const newItem = {
        id: (items.length + 1).toString(),
        name: itemName,
        maxAmount: 0, // Initialize maxAmount to 0
      };
      setItems([...items, newItem]);
      setItemName("");
    }
  };

  // Remove an item by ID
  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Set the max amount for the item
  const setMaxAmount = (id, value) => {
    const newItems = items.map((item) =>
      item.id === id ? { ...item, maxAmount: value } : item
    );
    setItems(newItems);
  };

  // Render each item
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={{flex: 1, justifyContent: 'space-between' ,flexDirection: 'row'}}>
        <Text style={styles.itemName}>{item.name}</Text>
        <FontAwesome6Icon
          style={{ marginEnd: 5 }}
          name="trash-alt"
          size={18}
          color={woo_black}
          onPress={() => removeItem(item.id)}
        />{" "}
      </View>

      {/* Input for setting maxAmount */}
      <SelectableInputCounter
        isGeneric={true}
        value={item.maxAmount}
        min={0}
        max={10}
        onChange={(text) => setMaxAmount(item.id, text)}
      />
    </View>
  );

  // const addListInput = () => {
  //   setList([...list, listItem]);
  //   listRef.current.clear();
  //   listRef.current.blur();
  // };

  // const handleListOnChange = (input) => {
  //   if (input.length > 0) {
  //     setListIconHidden(false);
  //   } else {
  //     setListIconHidden(true);
  //   }
  //   setIsListError(false);
  //   setListItem(input);
  // };

  // const handleListEndEditing = () => {
  //   setListIconHidden(true);
  // };

  return (
    <View style={styles.container}>
      <Header
        style={styles.header}
        backgroundColor={"#fff"}
        leftComponent={
          <Icon
            name="chevron-left"
            type="font-awesome-5"
            color={woo_black}
            size={25}
            onPress={() =>
              navigation.navigate("WooLocation", {
                wooMedia: wooMedia,
                wooType: wooType,
                wooMigos: wooMigos,
                migoWoos: migoWoos,
                wooDate: wooDate,
                wooTime: wooTime,
              })
            }
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
        rightComponent={
          <Icon
            name="chevron-right"
            type="font-awesome-5"
            color={woo_black}
            size={25}
            onPress={() =>
              navigation.navigate("WooPreviewEdit", {
                wooMedia: wooMedia,
                wooType: wooType,
                wooMigos: wooMigos,
                migoWoos: migoWoos,
                wooDate: wooDate,
                wooTime: wooTime,
                wooLocation: wooLocation,
                wooList: items,
              })
            }
          />
        }
        rightContainerStyle={styles.rightComponent}
        leftContainerStyle={styles.leftComponent}
        centerContainerStyle={styles.centerComponent}
      />
      {/* <LinearProgress
                style={{}}
                value={.83}
                color={woo_orange}
                variant="determinate"
            /> */}

      <KeyboardAvoidingView behavior="position">
        <Input
          value={itemName}
          onChangeText={setItemName}
          // ref={listRef}
          placeholder="add an item"
          leftIcon={
            <Icon
              style={{ paddingEnd: 5 }}
              type="font-awesome-5"
              name="clipboard-list"
              size={18}
            />
          }
          // errorStyle={{ color: 'red' }}
          // errorMessage={isListError && "sorry we couldn't find that List"}
          autoCapitalize="none"
        />
        <Button
          title="Add Item"
          onPress={addItem}
          buttonStyle={{
            backgroundColor: woo_orange,
            borderRadius: 3,
          }}
          containerStyle={{
            marginHorizontal: 10,
            marginBottom: 10,
          }}
        />
      </KeyboardAvoidingView>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileInfo: {
    textAlign: "center",
  },
  header: {
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.2,
    elevation: 4,
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
  itemContainer: {
    padding: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#d9d9d9",
    borderRadius: 8,
  },
  itemName: {
    fontWeight: "600",
    fontSize: 18,
  },
});

export default WooListScreen;
