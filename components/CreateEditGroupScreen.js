import { View, Text, StyleSheet, Pressable } from "react-native";

const CreateEditGropupScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.goBack()}>
        <Text>Create Edit Group Screen</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CreateEditGropupScreen;
