import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
  PanResponder,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Back icon from expo/vector-icons
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import { woo_white } from "../assets/colors";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function ImageGalleryWithPreview({ route, navigation }) {
  const { media, initialIndex = 0 } = route.params;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const flatListRef = useRef(null);
  const pan = useRef(new Animated.ValueXY()).current;

  // PanResponder to detect swipe down
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 20; // start responding if vertical swipe > 20px
      },
      onPanResponderMove: Animated.event([null, { dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 100) {
          // swipe down enough to close
          navigation.goBack();
        } else {
          // reset position
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    // Scroll to initial index on mount
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: initialIndex, animated: false });
    }
  }, [initialIndex]);

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.media_url }} style={styles.image} />
    </View>
  );

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: pan.y }] }]}
      {...panResponder.panHandlers}
    >
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
             <FontAwesome6Icon
                          name="angle-left"
                          style={{}}
                          size={30}
                          color={woo_white}
                          onPress={() => navigation.goBack()}
                        />
      </TouchableOpacity>

      {/* User Info */}
      {media[currentIndex]?.user && (
        <View style={styles.userInfo}>
          <Image source={{ uri: media[currentIndex].user.profile_pic_url }} style={styles.avatar} />
          <Text style={styles.username}>{media[currentIndex].user.username}</Text>
        </View>
      )}

      {/* Image Gallery */}
      <FlatList
        ref={flatListRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={media}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef.current}
      />

      {/* Preview Thumbnails */}
      <View style={styles.previewContainer}>
        {media.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => flatListRef.current.scrollToIndex({ index })}
            style={[
              styles.previewImageWrapper,
              currentIndex === index && styles.previewImageWrapperActive,
            ]}
          >
            <Image source={{ uri: item.media_url }} style={styles.previewImage} />
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  backButton: {
    position: "absolute",
    top: 55,
    left: 20,
    zIndex: 10,
  },
  userInfo: {
    position: "absolute",
    top: 45,
    right: 15,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  username: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  imageContainer: {
    width: Dimensions.get("window").width,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  previewContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  previewImageWrapper: {
    marginHorizontal: 5,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "transparent",
  },
  previewImageWrapperActive: {
    borderColor: "#fff",
  },
  previewImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
});

