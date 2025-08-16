// WooTagScreen.js

import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Keyboard,
  LayoutAnimation,
  Platform,
  UIManager,
  TouchableWithoutFeedback,
} from "react-native";
import { Header, Icon } from "@rneui/themed";
import { debounce } from "lodash";
import { woo_black, woo_gray } from "../assets/colors";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TAG_LIMIT = 5;
const MAX_TAG_LENGTH = 25;
const localhost = "http://192.168.12.240:3000";

const WooTagScreen = ({ navigation, route }) => {
  const { wooMedia, wooType, user, token } = route.params;

  const [selectedTags, setSelectedTags] = useState([]);
  const [customTag, setCustomTag] = useState("");
  const [tagError, setTagError] = useState("");
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [suggestedTags] = useState([
    "music",
    "food",
    "networking",
    "tech",
    "art",
    "fitness",
    "outdoor",
    "education",
    "gaming",
    "social",
  ]);

  const [customTags, setCustomTags] = useState([
    "photography",
    "business",
    "health",
    "travel",
    "diy",
    "film",
    "comedy",
    "startup",
    "science",
    "pets",
    "birthday",
  ]);

  useEffect(() => {
    searchTags(customTag);

    return () => {
      searchTags.cancel();
    };
  }, [customTag]);

  const searchTags = useMemo(
    () =>
      debounce(async (text) => {
        if (text.trim().length < 2) {
          setAutocompleteResults([]);
          return;
        }

        try {
          setIsSearching(true);
          const res = await fetch(`${localhost}/tags/search?query=${text}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // ← include token here
            },
          });
          const data = await res.json();
          console.log(`DATA is ${data}`);
          // Only include tags not already selected
          const filtered = data.filter(
            (tag) => !selectedTags.includes(tag.toLowerCase())
          );

          setAutocompleteResults(filtered);
        } catch (err) {
          console.error("Tag search error", err);
          setAutocompleteResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300),
    [selectedTags]
  );

  const availableSuggestedTags = useMemo(() => {
    return suggestedTags.filter((tag) => {
      const sanitized = tag.trim().toLowerCase();
      return !selectedTags.includes(sanitized);
    });
  }, [suggestedTags, selectedTags]);

  const allTags = [...suggestedTags, ...customTags];

  const atLimit = selectedTags.length >= TAG_LIMIT;

  const sanitizeTag = (tag) => {
    return tag.trim().toLowerCase();
    //   .replace(/[^a-z0-9-]/g, "");
  };

  const isValidTag = (tag) => {
    // Letters, numbers, spaces, hyphens only
    const regex = /^[a-z0-9\- ]+$/;
    return tag.length > 1 && tag.length <= MAX_TAG_LENGTH && regex.test(tag);
  };

  const addTag = (rawTag) => {
    const tag = sanitizeTag(rawTag);

    if (!isValidTag(tag)) {
      if (tag.length > MAX_TAG_LENGTH) {
        setTagError(`Tags must be ${MAX_TAG_LENGTH} characters or fewer.`);
      } else {
        setTagError("Use only letters, numbers, spaces, and hyphens.");
      }
      return;
    }

    if (selectedTags.includes(tag)) {
      setTagError("Tag already added.");
      return;
    }

    if (selectedTags.length >= TAG_LIMIT) {
      setTagError("You've reached the tag limit.");
      return;
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedTags([...selectedTags, tag]);
    setCustomTag("");
    setTagError("");
    Keyboard.dismiss();
  };

  const removeTag = (tag) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const handleContinue = () => {
    const eventId = route?.params?.eventId || 1;
    console.log("Selected Tags for Event ID", eventId, ":", selectedTags);
    navigation.navigate("NextScreen", { tags: selectedTags });
  };

  const autocompleteSuggestions = autocompleteResults;

  //   const autocompleteSuggestions = allTags.filter(
  //     (tag) =>
  //       tag.toLowerCase().startsWith(customTag.toLowerCase()) &&
  //       !selectedTags.includes(tag)
  //   );

  const renderHighlightedText = (text, highlight) => {
    const i = text.toLowerCase().indexOf(highlight.toLowerCase());
    if (i === -1 || highlight.length === 0) return text;

    const start = text.substring(0, i);
    const match = text.substring(i, i + highlight.length);
    const end = text.substring(i + highlight.length);

    return (
      <Text>
        {start}
        <Text style={{ fontWeight: "bold", color: "#007AFF" }}>{match}</Text>
        {end}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={"#fff"}
        centerComponent={<Text style={styles.headerTitle}>woo tags</Text>}
        leftContainerStyle={styles.leftComponent}
        rightContainerStyle={styles.rightComponent}
        centerContainerStyle={styles.centerComponent}
      />

      <View style={styles.body}>
        <Text style={styles.subheading}>custom tags</Text>
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          style={{ backgroundColor: "red" }}
          accessible={false}
        >
          {/* Input and Autocomplete */}
          <View style={{ position: "relative" }}>
            <View style={styles.inputRow}>
              <TextInput
                placeholder="enter a custom tag"
                value={customTag}
                onChangeText={(text) => {
                  setCustomTag(text);
                  if (tagError) setTagError("");
                }}
                style={styles.input}
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => addTag(customTag)}
                disabled={atLimit}
              >
                <Text style={styles.addButtonText}>add</Text>
              </TouchableOpacity>
            </View>

            {isSearching && (
              <Text style={{ color: "#999", marginBottom: 5 }}>
                Searching...
              </Text>
            )}

            {/* Autocomplete Dropdown */}
            {customTag.length > 0 && autocompleteSuggestions.length > 0 && (
              <ScrollView
                style={styles.autocompleteContainer}
                keyboardShouldPersistTaps="handled"
              >
                {autocompleteSuggestions.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    onPress={() => addTag(tag)}
                    style={styles.autocompleteItem}
                    activeOpacity={0.6}
                  >
                    <Text style={styles.autocompleteItemText}>
                      {renderHighlightedText(tag, customTag)}
                    </Text>
                    <Icon
                      name="add"
                      type="material"
                      size={20}
                      color="#007AFF"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </TouchableWithoutFeedback>
        {/* Suggested Tags */}
        <Text style={styles.subheading}>suggested tags</Text>
        <View style={styles.tagContainer}>
          {availableSuggestedTags.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={[styles.suggestedTag, atLimit && styles.disabledTag]}
              onPress={() => !atLimit && addTag(tag)}
              disabled={atLimit}
            >
              <Text style={[styles.tagText, atLimit && styles.disabledTagText]}>
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tag Limit Message */}
        {atLimit && (
          <Text style={styles.limitMessage}>
            Maximum of {TAG_LIMIT} tags reached.
          </Text>
        )}

        {/* Error message */}
        {tagError ? <Text style={styles.errorText}>{tagError}</Text> : null}

        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <>
            <Text style={styles.subheading}>selected tags</Text>
            <View style={styles.tagContainer}>
              {selectedTags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  onPress={() => removeTag(tag)}
                  style={styles.selectedTag}
                >
                  <Text style={styles.selectedTagText}>{tag}</Text>
                  <TouchableOpacity onPress={() => removeTag(tag)}>
                    <Text style={styles.removeText}>✕</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navButtons}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleContinue} style={styles.button}>
          <Icon name="arrow-right" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  body: { padding: 20 },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  subheading: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 25,
    color: woo_black,
    textAlign: "center",
    fontWeight: "bold",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 10,
  },
  addButton: {
    backgroundColor: woo_gray,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  addButtonText: { color: "#fff", fontWeight: "bold" },

  // Tags
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  suggestedTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#eee",
    borderRadius: 20,
  },
  tagText: { color: "#333" },
  disabledTag: { backgroundColor: "#ddd" },
  disabledTagText: { color: "#888" },

  selectedTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  selectedTagText: {
    color: "#fff",
    marginRight: 6,
  },
  removeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  limitMessage: {
    color: "red",
    fontSize: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    marginTop: 8,
    fontSize: 14,
  },

  // Autocomplete
  autocompleteContainer: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxHeight: 200,
    zIndex: 1000,
  },
  autocompleteItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  autocompleteItemText: {
    fontSize: 16,
    color: "#333",
    flexShrink: 1,
  },

  // Navigation
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
  leftComponent: { justifyContent: "center", alignItems: "center" },
  centerComponent: { justifyContent: "center", alignItems: "center" },
  rightComponent: { justifyContent: "center", alignItems: "center" },
});

export default WooTagScreen;
