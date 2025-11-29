import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { woo_orange, woo_white } from "../assets/colors";

const Button = ({
  text,
  onPress,
  buttonColor = woo_orange,
  textColor = woo_white,
}) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: buttonColor }]}
        onPress={onPress} // Function to create chat/group
      >
        <Text style={[styles.text, { color: textColor }]}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: 5, // Distance from the bottom of the screen
    left: 16,
    right: 16, // Optional: keep it aligned to left and right edges
    marginBottom: 5, // Adds space from bottom of the screen
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Button;
