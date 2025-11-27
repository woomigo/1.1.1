import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Header, Icon, LinearProgress } from "@rneui/themed";
import RNDateTimePicker from "@react-native-community/datetimepicker";

const RegisterDOBScreen = ({ navigation, route }) => {
  const { firstName, lastName } = route.params;

  const [dateOfBirth, setDateOfBirth] = useState(new Date());

  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate());
  const today = currentDate;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const day = currentDate.getDate();

  const dobMaximumDate = new Date(year - 13, month, day); // Today's date minus 13 YEARS

  return (
    <View style={styles.container}>
      <Header
        style={styles.header}
        backgroundColor={"#fff"}
        leftComponent={
          <Icon
            name="chevron-left"
            type="font-awesome-5"
            color="#f37320"
            size={25}
            onPress={() => navigation.navigate("RegisterFullname")}
          />
        }
        centerComponent={
          <View>
            <Text
              style={{
                fontSize: 25,
                color: "#f37320",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              register
            </Text>
          </View>
        }
        rightComponent={
          <Icon
            name="chevron-right"
            type="font-awesome-5"
            color="#f37320"
            size={25}
            onPress={() =>
              navigation.navigate("RegisterUsername", {
                firstName: firstName,
                lastName: lastName,
                dob: dateOfBirth.toLocaleDateString("en-us"),
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
                value={.4}
                color="#f37320"
                variant="determinate"
            /> */}

      <View
        style={{ flex: 0.8, alignItems: "center", justifyContent: "center" }}
      >
        <Text style={{ marginTop: 10, fontSize: 24, fontWeight: "bold" }}>
          Date of Birth:
        </Text>
        <RNDateTimePicker
          style={{ marginTop: 50 }}
          display="inline"
          mode="date"
          value={dateOfBirth}
          onChange={(event, date) => setDateOfBirth(date)}
          maximumDate={dobMaximumDate}
        />
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
});

export default RegisterDOBScreen;
