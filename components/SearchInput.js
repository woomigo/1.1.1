import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import debounce from "lodash.debounce";
import { Icon, Input } from "@rneui/themed";

const SearchInput = ({
  data = [],
  searchKey,
  placeholder = "search...",
  fontSize = 14,
  onResultsChange,
  showEmptyMessage = true,
  emptyMessage = "no results found...",
  icon = "search",
}) => {
  const [searchText, setSearchText] = useState("");
  const [filtered, setFiltered] = useState(data);

  useEffect(() => {
    setFiltered(data);
    onResultsChange?.(data);
  }, [data]);

  // Allows for searching for object key(s) using SEARCHKEY or for ARRAYS remove/don't use SEARCHKEY
  const performFilter = (text) => {
    const lower = text.toLowerCase();

    const filteredData = data.filter((item) => {
      if (typeof item === "string") {
        return item.toLowerCase().includes(lower);
      }

      if (Array.isArray(searchKey)) {
        // Multiple keys: return true if ANY match
        return searchKey.some((key) =>
          item[key]?.toLowerCase().includes(lower)
        );
      }

      // Single key fallback
      return item[searchKey]?.toLowerCase().includes(lower);
    });

    setFiltered(filteredData);
    onResultsChange?.(filteredData);
  };

  const debouncedSearch = useRef(debounce(performFilter, 300)).current;

  const handleSearch = (text) => {
    setSearchText(text);
    debouncedSearch(text);
  };

  const clearSearch = () => {
    setSearchText("");
    setFiltered(data);
    onResultsChange?.(data);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.inputWrapper}>
        <Input
          fontSize={fontSize}
          value={searchText}
          onChangeText={handleSearch}
          // ref={listRef}
          placeholder={placeholder}
          leftIcon={
            <Icon
              style={{ paddingEnd: 5 }}
              type="font-awesome-5"
              name={icon}
              size={18}
            />
          }
          //   errorStyle={{ color: 'red' }}
          //   errorMessage={showEmptyMessage && searchText.length > 0 && filtered.length === 0 && emptyMessage}
          autoCapitalize="none"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearIcon}>
            <Ionicons name="close-circle" size={20} color="#aaa" />
          </TouchableOpacity>
        )}
      </View>

      {showEmptyMessage && searchText.length > 0 && filtered.length === 0 && (
        <Text style={styles.emptyMessage}>{emptyMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 10,
    paddingHorizontal: 16,
    width: "100%",
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingRight: 35,
  },
  clearIcon: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  emptyMessage: {
    marginTop: 10,
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});

export default SearchInput;
