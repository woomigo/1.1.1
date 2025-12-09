import React, { useContext, useEffect, useState } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { localhost } from "./utility";
import { woo_black, woo_white } from "../assets/colors";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";

const FollowButton = ({ profileId, iconOnly = false, textIcon = false }) => {
  const { user, token } = useContext(AuthContext);

  const [isProfileOwnedByUser, setIsProfileOwnedByUser] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollower, setIsFollower] = useState(false);
  const [sentFollowRequest, setSentFollowRequest] = useState(null); // request sent by current user
  const [receivedFollowRequest, setReceivedFollowRequest] = useState(false); // request sent to current user
  const [isProfilePrivate, setIsProfilePrivate] = useState(false);
  const [followMessage, setFollowMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const showTemporaryFollowMessage = (message) => {
    setFollowMessage(message);
    setTimeout(() => setFollowMessage(null), 3000);
  };

  const fetchFollowState = async () => {
    try {
      setLoading(true);
      setIsProfileOwnedByUser(!profileId || profileId === user.id);

      // Fetch network state
      const res = await fetch(`${localhost}/followers/${profileId}/network`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setIsFollowing(data.followers.some((f) => f.user_id === user.id));
      setIsFollower(data.followees.some((f) => f.user_id === user.id));

      // Fetch privacy
      const countsRes = await fetch(
        `${localhost}/followers/${profileId}/follow-counts`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const countsData = await countsRes.json();
      setIsProfilePrivate(countsData.user.is_private);

      // Check sent follow request (from me to profile)
      if (!isProfileOwnedByUser && !isFollowing) {
        const sentRes = await fetch(
          `${localhost}/follow-requests/check?sender_id=${user.id}&receiver_id=${profileId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const sentData = await sentRes.json();
        setSentFollowRequest(sentData.exists ? sentData.request : null);
      }

      // Check received follow request (from profile to me)
      if (!isProfileOwnedByUser && !isFollowing) {
        const receivedRes = await fetch(
          `${localhost}/follow-requests/check?sender_id=${profileId}&receiver_id=${user.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const receivedData = await receivedRes.json();
        // console.log("RD ", receivedData.request);
        if (receivedData.exists && receivedData.request.status === "pending") {
          setReceivedFollowRequest(receivedData.request);
        }
      }
    } catch (err) {
      console.error("Error fetching follow state:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowState();
  }, [profileId]);

  // ---------------------------------------------------
  // Action handlers
  // ---------------------------------------------------
  const handleFollow = async () => {
    try {
      const res = await fetch(`${localhost}/followers/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ follower_id: user.id, followee_id: profileId }),
      });
      if (!res.ok) throw new Error("Failed to follow user");
      setIsFollowing(true);
      showTemporaryFollowMessage("Following!");
    } catch (err) {
      console.error(err);
    } finally {
      fetchFollowState();
    }
  };

  const handleUnfollow = async () => {
    try {
      const res = await fetch(`${localhost}/followers/unfollow`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ follower_id: user.id, followee_id: profileId }),
      });
      if (!res.ok) throw new Error("Failed to unfollow user");
      setIsFollowing(false);
      showTemporaryFollowMessage("Unfollowed!");
    } catch (err) {
      console.error(err);
    } finally {
      fetchFollowState();
    }
  };

  const handleSendFollowRequest = async () => {
     if (!token) throw new Error("Auth token is missing");
    if (!user.id) throw new Error("Sender ID is required");
    if (!profileId) throw new Error("Receiver ID is required");
    try {
      const res = await fetch(`${localhost}/follow-requests/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sender_id: user.id, receiver_id: profileId }),
      });
      if (!res.ok) throw new Error("Failed to send follow request");
      showTemporaryFollowMessage("Request sent!");
    } catch (err) {
      console.error(err);
    } finally {
      fetchFollowState();
    }
  };

  const handleCancelFollowRequest = async () => {
    try {
      const res = await fetch(`${localhost}/follow-requests/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sender_id: user.id, receiver_id: profileId }),
      });
      if (!res.ok) throw new Error("Failed to cancel follow request");
      showTemporaryFollowMessage("Request cancelled!");
    } catch (err) {
      console.error(err);
    } finally {
      fetchFollowState();
    }
  };

  const handleAcceptRequest = async () => {
    if (!receivedFollowRequest?.id) {
      console.error("No request ID to accept");
      return;
    }

    try {
      const res = await fetch(
        `${localhost}/follow-requests/${receivedFollowRequest.id}/accept`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to accept request");

      const data = await res.json();
      console.log("Accepted FOLLOWER Request:", data);

      showTemporaryFollowMessage("Request accepted!");
      setReceivedFollowRequest(null); // clear local state
      fetchFollowState(); // refresh button states
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeclineRequest = async () => {
    try {
      if (!receivedFollowRequest || !receivedFollowRequest.id) {
        throw new Error("No request ID to decline");
      }

      const res = await fetch(
        `${localhost}/follow-requests/${receivedFollowRequest.id}/decline`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to decline request");

      const data = await res.json();
      console.log("Declined FOLLOWER Request:", data);
      showTemporaryFollowMessage("Request declined!");
      setReceivedFollowRequest(false); // update local state
    } catch (err) {
      console.error(err);
    } finally {
      fetchFollowState(); // refresh button states
    }
  };

  // ---------------------------------------------------
  // Determine button states
  // ---------------------------------------------------
  const getButtonStates = () => {
    if (isProfileOwnedByUser)
      return [{ title: "Edit Profile", onPress: () => {} }];
    if (isFollowing)
      return [
        {
          title: "unfollow",
          onPress: handleUnfollow,
          icon: (
            <FontAwesome6Icon name="circle-minus" size={20} color={woo_white} />
          ),
        },
      ];

    // Sent follow request pending
    if (sentFollowRequest && sentFollowRequest.status === "pending") {
      return [
        {
          title: "pending",
          onPress: handleCancelFollowRequest,
          icon: (
            <FontAwesome6Icon name="user-minus" size={20} color={woo_white} />
          ),
        },
      ];
    }

    // Received follow request from this profile
    if (receivedFollowRequest) {
      return [
        {
          title: "accept",
          onPress: handleAcceptRequest,
          icon: (
            <FontAwesome6Icon name="user-check" size={20} color={woo_white} />
          ),
        },
        {
          title: "decline",
          onPress: handleDeclineRequest,
          icon: (
            <FontAwesome6Icon name="user-xmark" size={20} color={woo_white} />
          ),
        },
      ];
    }

    if (!isFollowing && isFollower && !isProfilePrivate) {
      return [
        {
          title: "follow back",
          onPress: handleFollow,
          icon: (
            <FontAwesome6Icon name="circle-plus" size={20} color={woo_white} />
          ),
        },
      ];
    }

    if (!isFollowing && isProfilePrivate) {
      return [
        {
          title: "request",
          onPress: handleSendFollowRequest,
          icon: (
            <FontAwesome6Icon name="user-plus" size={20} color={woo_white} />
          ),
        },
      ];
    }

    return [
      {
        title: "follow",
        onPress: handleFollow,
        icon: (
          <FontAwesome6Icon name="circle-plus" size={20} color={woo_white} />
        ),
      },
    ];
  };

  const buttonStates = getButtonStates();
  // Render icon only
  if (iconOnly) {
    return (
      // <--- add return here
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {buttonStates.map((btn, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.button,
              idx < buttonStates.length - 1 && { marginRight: 8 },
              loading && { opacity: 0.5 },
            ]}
            onPress={btn.onPress}
            disabled={loading}
          >
            <View style={styles.textIconWrapper}>{btn.icon}</View>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  // Render icon + text
  if (textIcon) {
    return (
      // <--- add return here
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {buttonStates.map((btn, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.button,
              idx < buttonStates.length - 1 && { marginRight: 8 },
              loading && { opacity: 0.5 },
            ]}
            onPress={btn.onPress}
            disabled={loading}
          >
            <View style={styles.textIconWrapper}>
              {btn.icon}
              <Text style={[styles.text, { marginLeft: 6 }]}>
                {followMessage || btn.title}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  // Default render (text only)
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {buttonStates.map((btn, idx) => (
        <TouchableOpacity
          key={idx}
          style={[
            styles.button,
            idx < buttonStates.length - 1 && { marginRight: 8 },
            loading && { opacity: 0.5 },
          ]}
          onPress={btn.onPress}
          disabled={loading}
        >
          <Text style={styles.text}>{followMessage || btn.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: woo_black,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  textIconWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default FollowButton;
