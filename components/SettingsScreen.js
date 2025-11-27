import { useEffect, useState } from "react";
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

  {
    /* <View style={styles.testContainer}>
        <Button title="Refresh Users" onPress={fetchUsers} />
        
        {editingUser && (
          <View style={styles.form}>
            <Text style={styles.editTitle}>Editing User ID {editingUser}</Text>
            <TextInput
              placeholder="Name"
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Email"
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Password"
              value={form.password}
              secureTextEntry
              onChangeText={(text) => setForm({ ...form, password: text })}
              style={styles.input}
            />
            <Button title="Save" onPress={updateUser} />
          </View>
        )}
  
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.userCard}>
              <Text style={styles.name}>{item.name}</Text>
              <Text>{item.email}</Text>
              <View style={styles.buttons}>
                <Button title="Edit" onPress={() => startEditing(item)} />
                <Button title="Delete" color="red" onPress={() => deleteUser(item.id)} />
              </View>
            </View>
          )}
        />
      </View> */
  }

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
  bodyContainer: {
    padding: 20,
  },
  privateProfileText: {
    marginBottom: 3,
    fontWeight: "bold",
  },
});

export default SettingsScreen;
