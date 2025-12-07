import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from "react-native";
import axios from "axios";
import { woo_orange } from "../assets/colors";
import { AuthContext } from "../context/AuthContext";
import { localhost } from "./utility";
import { FontAwesome } from "@expo/vector-icons";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";

const FollowButton = ({
  profileId,
  children,
  iconOnly = false,
  textIcon = false,
}) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const { token } = useContext(AuthContext);

  const fetchRelationshipStatus = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${localhost}/relationships/status`, {
        params: { profileId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatus(res.data);
    } catch (err) {
      console.error("Error fetching relationship status:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRelationshipStatus();
  }, [profileId]);

  if (loading)
    return (
      <ActivityIndicator
        size="small"
        color={woo_orange}
        style={{ margin: 10 }}
      />
    );

  if (!status) return null;

  const handleAction = async () => {
    try {
      if (
        status.relationship_status === "following" ||
        status.relationship_status === "mutual"
      ) {
        await axios.delete("/api/follow/unfollow", {
          data: { follower_id: status.viewer_id, followee_id: profileId },
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (
        status.relationship_status === "not_following" ||
        status.relationship_status === "follow_back"
      ) {
        await axios.post(
          "/api/follow/follow",
          { follower_id: status.viewer_id, followee_id: profileId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else if (status.relationship_status === "not_following_private") {
        await axios.post(
          "/api/follow-requests/send",
          { sender_id: status.viewer_id, receiver_id: profileId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchRelationshipStatus(); // refresh after action
    } catch (err) {
      console.error("Error handling follow action:", err);
    }
  };

  // Encapsulated logic for text and icon
  let buttonText = "Follow";
  let iconComponent = null;
  const color = textIcon ? "#fff" : iconOnly ? "#000" : woo_orange;

  switch (status.button) {
    case "none":
      buttonText = "me";
      iconComponent = (
        <FontAwesome6Icon name="face-smile-beam" size={20} color={color} />
      );
      break;
    case "follow":
      buttonText = "follow";
      iconComponent = (
        <FontAwesome6Icon name="circle-plus" size={20} color={color} />
      );
      break;
    case "unfollow":
      buttonText = "unfollow";
      iconComponent = (
        <FontAwesome6Icon name="circle-minus" size={20} color={color} />
      );
      break;
    case "requested":
         buttonText = "requested";
      iconComponent = (
        <FontAwesome6Icon name="user-minus" size={20} color={color} />
      );
    case "accept_or_decline":
      buttonText = "Accept / Decline";
      iconComponent = (
        <FontAwesome name="question-circle" size={20} color={color} />
      );
      break;
    case "request_follow":
         buttonText = " request follow";
      iconComponent = (
        <FontAwesome6Icon name="user-plus" size={20} color={color} />
      );
      break;
    default:
      buttonText = "follow";
      iconComponent = (
        <FontAwesome6Icon name="circle-plus" size={20} color={color} />
      );
  }

  const disabled = loading;

  // Render children function if provided
  if (typeof children === "function") {
    return children({
      onPress: handleAction,
      text: buttonText,
      disabled,
      icon: iconComponent,
    });
  }

  // Render icon only
  if (iconOnly) {
    return (
      <TouchableOpacity onPress={handleAction} disabled={disabled}>
        {iconComponent}
      </TouchableOpacity>
    );
  }

  // Render icon + text if requested
  if (textIcon) {
    return (
      <TouchableOpacity style={styles.followButton} onPress={handleAction}>
        <View style={styles.textIconWrapper}>
          {iconComponent}
          <Text style={[styles.followText, { marginLeft: 6 }]}>
            {buttonText}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  // Default: button with text only
  return (
    <TouchableOpacity style={styles.followButton} onPress={handleAction}>
      <Text style={styles.followText}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  followButton: {
    backgroundColor: woo_orange,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  followText: {
    color: "#fff",
    fontWeight: "bold",
  },
  textIconWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default FollowButton;
