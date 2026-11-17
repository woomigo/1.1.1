import { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import ActionBar from "./ActionBar";
import MigosAvatarGroup from "./MigosAvatarGroup";
import { useNavigation } from "@react-navigation/native";
import {
  woo_black,
  woo_white,
  woo_orange,
  woo_light_gray,
} from "../assets/colors";
import { getFormattedTime, getMonthAndDay, hexToRgba, localhost } from "./utility";

const LayoutWooItem = ({ woo, uid, token }) => {
  const navigation = useNavigation();
  const item = woo.item;

  const [isLiked, setIsLiked] = useState(Boolean(item.liked_by_me));
  const [wooLikeCount, setWooLikeCount] = useState(item.like_count);

  const { month, day } = getMonthAndDay(item.start_date);
  const wooStartTime = getFormattedTime(item.start_time);
  const wooEndTime = getFormattedTime(item.end_time);

  const toggleIsLiked = async () => {
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setWooLikeCount((prev) => prev + (nextLiked ? 1 : -1));

    try {
      const response = await fetch(`${localhost}/woo-likes/${nextLiked ? "like" : "unlike"}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ woo_id: item.woo_id }),
      });

      if (!response.ok) throw new Error("Failed to toggle like");
    } catch (error) {
      console.error("Error liking woo:", error);
      setIsLiked(!nextLiked);
      setWooLikeCount((prev) => prev + (nextLiked ? -1 : 1));
    }
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => navigation.navigate("Woo", { uid: uid, woo: woo })}
      >
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{ uri: item.media_url }} />
          <LinearGradient
            colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.8)"]}
            style={styles.gradient}
            pointerEvents="none"
          />
          <View style={styles.hostContainer}>
            <Image
              style={styles.hostAvatar}
              source={{ uri: item.profile_pic_url }}
            />
            <View style={{ marginStart: 8, flex: 1 }}>
              <Text style={styles.hostName}>
                {item.first_name} {item.last_name}
              </Text>
              <Text style={styles.hostUsername}>@{item.username}</Text>
            </View>
          </View>
          {item.tags && item.tags.length > 0 && (
            <ScrollView
              horizontal
              style={styles.tagsContainer}
              showsHorizontalScrollIndicator={false}
            >
              {item.tags.map((tag, idx) => (
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

      <ActionBar
        liked={isLiked}
        likeCount={wooLikeCount}
        subscribed={false}
        hostName={`${item.first_name} ${item.last_name}`}
        wooType={item.type}
        onToggleLike={toggleIsLiked}
        onToggleSubscribe={() => {}}
        onShare={() => console.log("Share Woo")}
      />

      <View style={styles.detailsContainer}>
        <View style={styles.detailsLeft}>
          <View style={styles.detailRow}>
            <FontAwesome6Icon
              name="calendar"
              size={13}
              color={woo_orange}
              style={styles.detailIcon}
            />
            <Text style={styles.detailText}>
              {month} {day}
              {item.start_time
                ? ` · ${wooStartTime}${
                    item.end_time != null ? " - " + wooEndTime : ""
                  }`
                : ""}
            </Text>
          </View>
          {item.location && (
            <View style={styles.detailRow}>
              <FontAwesome6Icon
                name="location-dot"
                size={13}
                color={woo_orange}
                style={styles.detailIcon}
              />
              <Text style={styles.detailText} numberOfLines={1}>
                {item.location.address}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.migosWrapper}>
          <MigosAvatarGroup
            alignRow="flex-end"
            migos={
              item.type === "public"
                ? item.sub_profile_pics
                : item.migo_profile_pics
            }
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: woo_white,
    borderRadius: 12,
    marginHorizontal: 10,
    marginBottom: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  imageContainer: {
    position: "relative",
    height: 320,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  hostContainer: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  hostAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: woo_white,
    backgroundColor: woo_light_gray,
  },
  hostName: {
    fontSize: 16,
    color: woo_white,
    fontWeight: "bold",
  },
  hostUsername: {
    fontSize: 12,
    color: woo_white,
  },
  tagsContainer: {
    position: "absolute",
    bottom: 60,
    left: 12,
    right: 12,
    height: 30,
  },
  tagPill: {
    backgroundColor: hexToRgba(woo_black, 0.7),
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 8,
    justifyContent: "center",
  },
  pendingTag: {
    backgroundColor: "#FF9500",
  },
  tagText: {
    color: woo_white,
    fontSize: 12,
    fontWeight: "600",
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 2,
    gap: 12,
  },
  detailsLeft: {
    flex: 1,
    gap: 6,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailIcon: {
    width: 14,
    textAlign: "center",
  },
  detailText: {
    fontSize: 12,
    color: woo_black,
    flexShrink: 1,
  },
  migosWrapper: {
    marginEnd: 8,
  },
});

export default LayoutWooItem;
