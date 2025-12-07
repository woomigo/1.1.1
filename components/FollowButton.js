import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { woo_orange } from "../assets/colors";
import { AuthContext } from "../context/AuthContext";
import { localhost } from "./utility";

const FollowButton = ({ profileId, children }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const { token } = useContext(AuthContext);

  const fetchRelationshipStatus = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${localhost}/relationships/status`, {
        params: { profileId: profileId },
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

  let buttonText = "Follow";
  switch (status.button) {
    case "none":
      return null;
    case "follow":
      buttonText = "Follow";
      break;
    case "unfollow":
      buttonText = "Unfollow";
      break;
    case "requested":
      buttonText = "Requested";
      break;
    case "accept_or_decline":
      buttonText = "Accept / Decline";
      break;
    case "request_follow":
      buttonText = "Request Follow";
      break;
    default:
      buttonText = "Follow";
  }

  const disabled = loading;

  if (typeof children === "function") {
    return children({ onPress: handleAction, text: buttonText, disabled });
  }

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
});

export default FollowButton;
