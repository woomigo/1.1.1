import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  Text
} from "react-native";
// import Video from "expo-video";
import { getTimeAgo } from "./utility";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const IMAGE_DURATION = 5000;

const localhost = "http://192.168.12.240:3000";

export default function StoryViewerScreen({ route, navigation }) {
  const { token, stories, isUserStory, initialIndex = 0 } = route.params;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [videoRef, setVideoRef] = useState(null);
  const progress = useRef(new Animated.Value(0)).current;

  const currentStory = stories[currentIndex];

  useEffect(() => {
    startProgress();
    markStorySeen(stories[currentIndex].id);

    return () => {
      progress.stopAnimation();
      videoRef?.stopAsync?.();
    };
  }, [currentIndex]);

  const markStorySeen = async (storyId) => {
    try {
      await fetch(`${localhost}/stories/${storyId}/seen?type=${!isUserStory ? "event" : "user"}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error("Failed to mark story as seen:", err);
    }
  };

  const startProgress = () => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: currentStory.type === "image" ? IMAGE_DURATION : 10000,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) goToNext();
    });
  };

  const goToNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.goBack();
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleTap = (event) => {
    const { locationX } = event.nativeEvent;
    if (locationX < SCREEN_WIDTH / 2) {
      goToPrev();
    } else {
      goToNext();
    }
  };

  const renderMedia = () => {
    if (currentStory.media_type === "image") {
      return (
        <Image
          source={{ uri: currentStory.media_url }}
          style={styles.media}
          resizeMode="cover"
        />
      );
    } else {
      return (
        <Video
          source={{ uri: currentStory.url }}
          style={styles.media}
          resizeMode="cover"
          shouldPlay
          isLooping={false}
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              goToNext();
            }
          }}
        />
      );
    }
  };

  const renderProgressBars = () => {
    return (
      <View style={styles.progressBarContainer}>
        {stories.map((_, index) => {
          if (index === currentIndex) {
            // Animate width from 0% to 100%
            const width = progress.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
              extrapolate: 'clamp',
            });
  
            return (
              <View key={index} style={styles.progressBackground}>
                <Animated.View
                  style={[styles.progressForeground, { width }]}
                />
              </View>
            );
          } else {
            return (
              <View key={index} style={styles.progressBackground}>
                <View
                  style={[
                    styles.progressForeground,
                    { width: index < currentIndex ? '100%' : '0%' },
                  ]}
                />
              </View>
            );
          }
        })}
      </View>
    );
  };
  

  const renderUserInfo = () => {
    return (
      <View style={styles.overlay}>
        <Image
          source={{ uri: currentStory.user.avatar }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.username}>{currentStory.user.username}</Text>
          <Text style={styles.timestamp}>
            {getTimeAgo(currentStory.created_at)}
          </Text>
        </View>
      </View>
    );
  };

  console.log("Current Story:", isUserStory);

  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <View style={styles.container}>
        {renderMedia()}
        {
        // !isUserStory && 
        renderUserInfo()}
        {renderProgressBars()}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  media: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  progressBarContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 55 : 35,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressBackground: {
    flex: 1,
    height: 3,
    backgroundColor: "#555",
    marginHorizontal: 2,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressForeground: {
    backgroundColor: "#fff",
    height: 3,
  },
  overlay: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 8,
    borderRadius: 20,
    marginTop: 10
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginRight: 8,
  },
  username: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  timestamp: {
    color: "#ddd",
    fontSize: 12,
  },
});
