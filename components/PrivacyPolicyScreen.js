import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Header, Icon } from "@rneui/themed";
import { woo_black, woo_white } from "../assets/colors";
import WebView from "react-native-webview";

const PrivacyPolicyScreen = ({ route, navigation }) => {
  const { uid } = route.params;
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
              privacy policy
            </Text>
          </View>
        }
        leftContainerStyle={styles.leftComponent}
        centerContainerStyle={styles.centerComponent}
      />
      <WebView style={{}} source={{ uri: "https://woomigo.com/privacy-policy" }} />
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
});

export default PrivacyPolicyScreen;
