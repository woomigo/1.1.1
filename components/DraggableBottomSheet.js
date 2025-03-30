import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import { woo_black, woo_orange } from "../assets/colors";
import { Avatar, Input, Icon, Switch } from "@rneui/themed";

const DraggableBottomSheet = ({
  profilePicURL,
  title,
  isVisible = false,
  children,
  onClose,
  showListIcon = false,
  toggleSwitch,
  isSwitchEnabled,
  placeholderText,
  showInput,
}) => {
  const bottomSheetRef = useRef(null);
  const snapPoints = [780];
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        bottomSheetRef.current.snapToIndex(1); // Move to the first snap point
      }, 100); // Small delay to ensure smooth scrolling
    }
  }, [isVisible]);

  // const handleClosePress = useCallback(() => {
  //   bottomSheetRef.current?.close();
  //   onClose();
  // }, [onClose]);

  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    // <KeyboardAvoidingView
    //   behavior={Platform.OS === "ios" ? "padding" : "height"}
    //   // style={styles.container}
    // >
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={isVisible ? 0 : -1}
      onClose={onClose}
      onChange={handleSheetChanges}
      enablePanDownToClose
    >
      <BottomSheetView style={styles.contentContainer}>
        <View>
          <View style={styles.titleContainer}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>{title}</Text>
            <View style={styles.iconContainer}>
              {showListIcon && (
                <>
                  <FontAwesome6Icon
                    style={{ marginEnd: 5 }}
                    name="list"
                    size={20}
                    color={woo_black}
                  />
                  <Switch
                    trackColor={{ false: "#767577", true: woo_orange }}
                    // thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isSwitchEnabled}
                  />
                </>
              )}
            </View>
          </View>
          {children}
          {/* <BottomSheetFlatList>{children}</BottomSheetFlatList> */}
        </View>

        {/* Fixed Input for Comments */}
        {showInput && (
          <View style={styles.inputContainer}>
            {/* <TextInput
                style={styles.input}
                placeholder="Write a comment..."
                value={comment}
                onChangeText={setComment}
              /> */}
            <Input
              value={comment}
              // ref={commentRef}
              fontSize={12}
              // onChangeText={(text) => handleCommentOnChange(text)}
              onChangeText={setComment}
              placeholder={placeholderText}
              leftIcon={
                <Avatar rounded size="small" source={{ uri: profilePicURL }} />
              }
              autoCapitalize="none"
              // onEndEditing={() => handleCommentEndEditing()}
              rightIcon={
                // <Icon
                //   name="play"
                //   type="font-awesome-5"
                //   size={18}
                //   onPress={() => addCommentToWoo()}
                // />

                <FontAwesome6Icon
                  style={{ marginEnd: 5 }}
                  name="play"
                  size={18}
                  color={woo_black}
                  onPress={() => console.log("Comment:", comment)}
                />
              }
            />
            {/* <TouchableOpacity
                style={styles.sendButton}
                onPress={() => console.log("Comment:", comment)}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity> */}
          </View>
        )}
      </BottomSheetView>
    </BottomSheet>
    // </KeyboardAvoidingView>
    // <BottomSheet
    //   ref={bottomSheetRef}
    //   // index={isVisible ? 0 : -1}
    //   onChange={() => handleSheetChanges(isVisible ? 0 : -1)}
    //   snapPoints={snapPoints}
    //   enablePanDownToClose={true}
    //   onClose={onClose}
    // >
    //   <View style={styles.sheetContent}>

    //     {/* Close Button */}
    //     <TouchableOpacity style={styles.closeButton} onPress={handleClosePress}>
    //       <Text style={styles.closeButtonText}>Close</Text>
    //     </TouchableOpacity>
    //   </View>
    // </BottomSheet>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 10,
    // backgroundColor: "blue",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  iconContainer: { flexDirection: "row", marginEnd: 5, alignItems: "center" },
  inputContainer: {
    // marginBottom: 5,
    // flexDirection: "row",
    // alignItems: "center",
    // borderTopWidth: 1,
    // borderColor: "#ddd",
    // paddingVertical: 10,
    // backgroundColor: "white",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 50,
    padding: 10,
    backgroundColor: "red",
    borderRadius: 8,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default DraggableBottomSheet;
