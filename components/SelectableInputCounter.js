import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { woo_gray, woo_orange } from "../assets/colors";

const SelectableInputCounter = ({
  isGeneric = false,
  value,
  min,
  max,
  onChange,
  itemsAmt = 5,
  itemsSlctd = 0,
}) => {
  // If not generic, calculate limits based on items left
  const derivedMin = isGeneric ? min : 0;
  const derivedMax = isGeneric ? max : itemsAmt - itemsSlctd;
  const [inputValue, setInputValue] = useState(value?.toString() || "0");
  const [error, setError] = useState("");

  useEffect(() => {
    setInputValue(value?.toString() || "0");
  }, [value]);

  const updateValue = (newVal) => {
    if (newVal >= derivedMin && newVal <= derivedMax) {
      setInputValue(newVal.toString());
      setError("");
      onChange?.(newVal);
    } else {
      setError(`Value must be between ${derivedMin} and ${derivedMax}`);
    }
  };

  const handleChange = (text) => {
    if (text === "") {
      setInputValue("");
      return;
    }

    const num = parseInt(text, 10);
    if (!isNaN(num)) {
      updateValue(num);
    }
  };

  const increment = () => {
    const current = parseInt(inputValue, 10) || 0;
    const newVal = current + 1;
    if (newVal <= derivedMax) {
      updateValue(newVal);
    } else {
      setError(`Max is ${derivedMax}`);
    }
  };

  const decrement = () => {
    const current = parseInt(inputValue, 10) || 0;
    const newVal = current - 1;
    if (newVal >= derivedMin) {
      updateValue(newVal);
    } else {
      setError(`Min is ${derivedMin}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.counterRow}>
        <TouchableOpacity onPress={decrement} style={styles.iconButton}>
          <Ionicons name="remove-circle-outline" size={26} color={woo_gray} />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={inputValue}
          onChangeText={handleChange}
          onBlur={() => Keyboard.dismiss()}
        />

        <TouchableOpacity onPress={increment} style={styles.iconButton}>
          <Ionicons
            name="add-circle-outline"
            size={26}
            color={parseInt(inputValue, 10) >= derivedMax ? "#ccc" : woo_gray}
          />
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {!isGeneric && (
        <Text style={styles.infoText}>
          select up to {derivedMax} more item{derivedMax !== 1 ? "s" : ""}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
  },
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
  },
  iconButton: {
    padding: 4,
  },
  input: {
    width: 50,
    height: 32,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    textAlign: "center",
    fontSize: 16,
    marginHorizontal: 8,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  infoText: {
    marginTop: 4,
    fontSize: 12,
    color: "#666",
  },
});

export default SelectableInputCounter;
