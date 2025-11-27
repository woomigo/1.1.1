import { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Icon, Header, Input, Avatar } from "@rneui/themed";
import { woo_white, woo_black } from "../assets/colors";
import ListViewGallery from "./ListViewGallery";
import { Gallery } from "./shared";

const WooGalleryView = ({ navigation, route }) => {
  const { wooGallery } = route.params;

  useEffect(() => {
    console.log("WOOGALLERY " + wooGallery);
  });

  return (
    <View style={styles.container}>
      <Header
        containerStyle={styles.header}
        backgroundColor={woo_white}
        leftComponent={
          <Icon
            name="chevron-down"
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
              woo gallery
            </Text>
          </View>
        }
        leftContainerStyle={styles.leftComponent}
        centerContainerStyle={styles.centerComponent}
      />
      {/* <ListViewGallery
                gallery={gallery}
                inverted
                view={"grid"}
                nav={"MediaView"}
              /> */}
      <ListViewGallery gallery={wooGallery} view={"grid"} nav={"MediaView"} />
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
export default WooGalleryView;
