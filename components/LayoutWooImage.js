import React from 'react';
import { View, Text, Image, ScrollView, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { hexToRgba } from './utility';
import { woo_gray, woo_orange } from '../assets/colors';


const LayoutWooImage = ({
  uid,
  woo,
  token,
  // wooID,
  // wooDate,
  // image,
  // wooLikes,
  // wooMigos,
  // wooType,
  // ownerUID,
  // ownerUsername,
  // ownerProfilePicture,
  // ownerFirstName,
  // ownerLastName,
  // wooLikedByMe,
  // wooTime,
  // wooLocation,
  // wooComments,
  // wooGallery,
  // wooList,
  // startTime,
  // endTime,
}) => {
  const navigation = useNavigation();



  return (
    <TouchableWithoutFeedback
      onPress={() =>
        navigation.navigate("Woo", {
          uid: uid,
          woo: woo,
        })
      }
    >
      <View style={styles.container}>
        <Image style={styles.image} source={{ uri: woo.item.media_url }} />
  
        {/* Tags overlay */}
        {woo.item.tags && woo.item.tags.length > 0 && (
          <ScrollView horizontal style={styles.tagsContainer} showsHorizontalScrollIndicator={false}>
            {woo.item.tags.map((tag, idx) => (
              <View
                key={idx}
                style={[styles.tagPill, tag.pending ? styles.pendingTag : null]}
              >
                <Text style={styles.tagText}>
                  {tag.name} {tag.pending ? "(Pending)" : ""}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
  
};

const styles = StyleSheet.create({
  container: {
    position: "relative",

    height: 600,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  tagsContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    height: 40,
  },
  tagPill: {
    backgroundColor: hexToRgba(woo_gray, .7), // blue with 70% opacity
    paddingHorizontal: 20,

    borderRadius: 20,
    marginRight: 8,
    justifyContent: "center",
  },
  
  pendingTag: {
    backgroundColor: "#FF9500",
  },
  tagText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default LayoutWooImage;
