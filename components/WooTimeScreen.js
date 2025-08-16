import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Header, Icon, LinearProgress } from "@rneui/themed";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { woo_black, woo_orange } from "../assets/colors";

const WooTimeScreen = ({ route, navigation }) => {
  const { wooMedia, wooType, wooMigos, wooTags, wooDate } = route.params;

  const [time, setTime] = useState(new Date());

  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate());
  const today = currentDate;

  return (
    <View style={styles.container}>
      <Header
        style={styles.header}
        backgroundColor={"#fff"}
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
              woo time
            </Text>
          </View>
        }
        centerContainerStyle={styles.centerComponent}
      />

      {/* <LinearProgress
                style={{}}
                value={.50}
                color={woo_orange}
                variant="determinate"
            /> */}

      <View style={{ flex: 1, alignItems: "center" }}>
        <RNDateTimePicker
          style={{ marginTop: 50 }}
          display="spinner"
          mode="time"
          value={time}
          onChange={(event, time) => setTime(time)}
          minimumDate={today}
        />

        {/* Navigation Buttons */}
        <View style={styles.navButtons}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("WooDate", {
                wooMedia: wooMedia,
                wooType: wooType,
                wooMigos: wooMigos,
                wooTags: wooTags,
              })
            }
            style={styles.button}
          >
            <Icon name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={{ marginTop: 10, fontSize: 24, fontWeight: "bold" }}>
            {time.toLocaleTimeString("en-us", { timeStyle: "short" })}
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("WooLocation", {
                wooMedia: wooMedia,
                wooType: wooType,
                wooMigos: wooMigos,
                wooTags: wooTags,
                wooDate: wooDate,
                wooTime: time.toLocaleTimeString("en-us", {
                  timeStyle: "short",
                }),
              })
            }
            style={styles.button}
          >
            <Icon name="arrow-right" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
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
  navButtons: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 30,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default WooTimeScreen;
