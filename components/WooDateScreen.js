import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Header, Icon, LinearProgress } from "@rneui/themed";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { woo_black, woo_orange } from "../assets/colors";

const WooDateScreen = ({ route, navigation }) => {
  const { wooMedia, wooType, wooMigos, migoWoos } = route.params;

  const [date, setDate] = useState(new Date());

  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate());
  const today = currentDate;

  useEffect(() => {
    console.log("WOOMIGOS " + wooMigos);
  });

  return (
    <View style={styles.container}>
      <Header
        style={styles.header}
        backgroundColor={"#fff"}
        // leftComponent={
        //     <Icon
        //         name="chevron-left"
        //         type='font-awesome-5'
        //         color={woo_black}
        //         size={25}
        //         onPress={() => {
        //             wooType === 'private' ?
        //                 navigation.navigate('WooMigos', { wooMedia: wooMedia, wooType: wooType })
        //                 :
        //                 navigation.navigate('EditMedia', { wooMedia: wooMedia })
        //         }}
        //     />}
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
              woo date
            </Text>
          </View>
        }
        // rightComponent={
        //     <Icon
        //         name="chevron-right"
        //         type='font-awesome-5'
        //         color={woo_black}
        //         size={25}
        //         onPress={() =>
        //             navigation.navigate('WooTime', { wooMedia: wooMedia, wooType: wooType, wooMigos: wooMigos, migoWoos: migoWoos, wooDate: date.toLocaleDateString('en-us') })
        //         }
        //     />
        // }
        rightContainerStyle={styles.rightComponent}
        leftContainerStyle={styles.leftComponent}
        centerContainerStyle={styles.centerComponent}
      />

      {/* <LinearProgress
                style={{}}
                value={.33}
                color={woo_orange}
                variant="determinate"
            /> */}

      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <RNDateTimePicker
          style={{ marginTop: 20 }}
          display="inline"
          mode="date"
          value={date}
          onChange={(event, date) => setDate(date)}
          minimumDate={today}
        />

        {/* <View style={{ marginBottom: 50 }}>
         
        </View> */}

        {/* Navigation Buttons */}
        <View style={styles.navButtons}>
          <TouchableOpacity
            onPress={() => {
              wooType === "private"
                ? navigation.navigate("WooMigos", {
                    wooMedia: wooMedia,
                    wooType: wooType,
                  })
                : navigation.navigate("WooTags", { wooMedia: wooMedia });
            }}
            style={styles.button}
          >
            <Icon name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={{ marginTop: 10, fontSize: 24, fontWeight: "bold" }}>
            {date.toLocaleDateString("en-us")}
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("WooTime", {
                wooMedia: wooMedia,
                wooType: wooType,
                wooMigos: wooMigos,
                migoWoos: migoWoos,
                wooDate: date.toLocaleDateString("en-us"),
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

export default WooDateScreen;
