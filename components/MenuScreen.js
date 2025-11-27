import { useContext } from "react";
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Header, Icon, Avatar } from "@rneui/themed";
import { MenuItems } from "./shared";
import LayoutMenuItem from "./LayoutMenuItem";
import { woo_black } from "../assets/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/AuthContext";

const MenuScreen = ({ navigation, route, user }) => {
  const renderMenuItems = (menuItem) => <LayoutMenuItem menuItem={menuItem} />;

  // const logout = () => {
  //   signOut(auth)
  //     .then(() => {
  //       // Sign-out successful.
  //     })
  //     .catch((error) => {
  //       // An error happened.
  //     });
  // };

  // const logout = async () => {
  //   // Remove the token from AsyncStorage
  //   await AsyncStorage.removeItem("token");
  //   // navigation.navigate('Login');
  // };

  const { logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Header
        containerStyle={styles.header}
        backgroundColor={"#fff"}
        centerComponent={
          <View>
            <Text
              style={{
                fontSize: 25,
                color: { woo_black },
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              menu
            </Text>
          </View>
        }
        rightContainerStyle={styles.rightComponent}
        leftContainerStyle={styles.leftComponent}
        centerContainerStyle={styles.centerComponent}
      />
      {user && (
        <View style={styles.profilePicContainer}>
          <Avatar
            rounded
            size="medium"
            onPress={() => navigation.navigate("Profile")}
            source={{ uri: user.profile_pic_url }}
          />
          <Icon
            name="star"
            type="font-awesome-5"
            color="#f37320"
            size={20}
            style={styles.starIcon}
            solid
          />

          <Text style={styles.firstLastNameText}>
            {user.first_name} {user.last_name}
          </Text>
          <Text style={styles.usernameText}>@{user.username}</Text>
          {/* <Text style={styles.numOfMigosText}>migos: {user.migos.length}</Text> */}
        </View>
      )}

      <View style={styles.headerBottomBorder} />

      <FlatList
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        backgroundColor={"#fff"}
        keyExtractor={(woo) => woo.id}
        data={MenuItems}
        renderItem={renderMenuItems}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
      />

      <TouchableOpacity
        onPress={() => logout()}
        style={{
          flex: 1,
          backgroundColor: "#fff",
          alignItems: "center",
          flexDirection: "row",
          padding: 15,
        }}
      >
        <Icon
          name="sign-out-alt"
          type="font-awesome-5"
          color="#f37320"
          size={20}
        />
        <Text style={{ fontSize: 20, marginStart: 10 }}>{"logout"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  // header: {
  //     shadowColor: '#000',
  //     shadowOffset: { width: 1, height: 3 },
  //     shadowOpacity: 0.2,
  //     elevation: 4,
  // },
  leftComponent: {
    justifyContent: "center",
    alignItems: "center",
  },
  menuTextContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  menuText: {
    fontSize: 22,
    color: "#f37320",
  },
  profilePicContainer: {
    // flex: 1,
    alignItems: "center",
    margin: 20,
  },
  firstLastNameText: {
    fontWeight: "bold",
    margin: 3,
    fontSize: 20,
  },
  usernameText: {
    margin: 3,
    fontSize: 16,
  },
  numOfMigosText: {
    margin: 3,
    fontSize: 16,
  },
  headerBottomBorder: {
    backgroundColor: "#f37320",
    height: 2,
    width: "100%",
  },
  starIcon: {
    margin: 3,
  },
});

export default MenuScreen;
