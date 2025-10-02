import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import axios from "axios";
import { Header, Icon } from "@rneui/themed";
import { woo_black, woo_white } from "../assets/colors";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";

const WooListItems = (props) => {
  const { navigation } = props;
  // Support both navigation and direct props
  const routeParams = props.route?.params || {};

  // Merge route params and props, giving direct props precedence
  const user = props.user || routeParams.user;
  const items = props.items || routeParams.items;
  const token = props.token || routeParams.token;
  const showPreviewOnly =
    props.showPreviewOnly ?? routeParams.showPreviewOnly ?? false;

  const [quantities, setQuantities] = useState({});

  const localhost = "http://192.168.12.240:3000";

  useEffect(() => {
    // fetchWooList();
    console.log(`WOO LIST SCREEN ${JSON.stringify(items)}`);
  }, []);

  //   const fetchWooList = async () => {
  //     try {
  //         const res = await fetch(`${localhost}/lists/${wooId}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       const data = await res.json();
  //       setItems(data.items);
  //       console.log(`WOO LIST ITEMS ${JSON.stringify(data.items)}`)
  //     } catch (err) {
  //       console.error(err);
  //       Alert.alert('Error', 'Failed to load items.');
  //     }
  //   };

  const handleClaim = async (itemId) => {
    const quantity = parseInt(quantities[itemId], 10);
    if (!quantity || quantity <= 0) {
      return Alert.alert("Invalid quantity");
    }

    try {
      await axios.post(
        `https://your-api.com/api/list-items/${itemId}/claim`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuantities((prev) => ({ ...prev, [itemId]: "" }));
      fetchWooList();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to claim item.");
    }
  };

  const promptEditClaim = (itemId, claim) => {
    Alert.prompt(
      "Update quantity",
      `Current: ${claim.quantity}`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Update",
          onPress: async (newQty) => {
            const quantity = parseInt(newQty, 10);
            if (!quantity || quantity <= 0) {
              return Alert.alert("Invalid quantity");
            }
            try {
              await axios.put(
                `https://your-api.com/api/claims/${claim.id}`,
                { quantity },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              fetchWooList();
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "Failed to update claim.");
            }
          },
        },
      ],
      "plain-text",
      String(claim.quantity)
    );
  };

  const handleRemoveClaim = async (claimId) => {
    Alert.alert("Confirm", "Remove your claim?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            await axios.delete(`https://your-api.com/api/claims/${claimId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            fetchWooList();
          } catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to remove claim.");
          }
        },
      },
    ]);
  };

  const renderClaimedBy = (claims, itemId) => {
    return (
      <View style={styles.claimedRow}>
        {claims.map((c, idx) => {
          const isMe = c.user_id === user.id;

          return (
            <View key={idx} style={styles.claimedUser}>
              <Image
                source={{ uri: c.profile_pic_url }}
                style={styles.avatar}
              />
              <Text style={styles.claimedText}>
                {c.username} ({c.quantity})
              </Text>
              {isMe && (
                <>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => promptEditClaim(itemId, c)}
                  >
                    <Text style={styles.editText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => handleRemoveClaim(c.id)}
                  >
                    <Text style={styles.removeText}>X</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  const renderListPreview = () => {
    if (items.length === 0) return null;

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.previewScroll}
      >
        {items.map((item) => (
          <View key={item.id} style={styles.previewItem}>
            {!item.media_url ? (
              <FontAwesome6Icon
                name="circle-check"
                solid
                size={16}
                color={woo_black}
              />
            ) : (
              <Image
                source={{ uri: item.media_url }}
                style={styles.previewImage}
              />
            )}

            <Text style={styles.previewName} numberOfLines={1}>
              {item.name}
            </Text>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderItem = ({ item }) => {
    const claimed = item.claims.reduce((sum, c) => sum + c.quantity, 0);
    const available = item.max_quantity - claimed;

    return (
      <View style={styles.itemContainer}>
        <Image source={{ uri: item.media_url }} style={styles.itemImage} />
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemMeta}>
          {claimed}/{item.max_quantity} claimed
        </Text>

        {item.claims?.length > 0 && renderClaimedBy(item.claims, item.id)}

        {available > 0 ? (
          <View style={styles.claimRow}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Qty"
              value={quantities[item.id] || ""}
              onChangeText={(text) =>
                setQuantities((prev) => ({ ...prev, [item.id]: text }))
              }
            />
            <TouchableOpacity
              onPress={() => handleClaim(item.id)}
              style={styles.claimButton}
            >
              <Text style={styles.claimButtonText}>Claim</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.fullyClaimedText}>Fully claimed</Text>
        )}
      </View>
    );
  };

  return showPreviewOnly ? (
    <View style={{ paddingVertical: 8 }}>{renderListPreview()}</View>
  ) : (
    <View style={{ flex: 1 }}>
      <Header
        containerStyle={styles.header}
        backgroundColor={woo_white}
        leftComponent={
          <Icon
            name="chevron-down"
            type="font-awesome-5"
            color={woo_black}
            size={20}
            onPress={() => navigation.goBack()}
          />
        }
        centerComponent={
          <View>
            <Text
              style={{
                fontSize: 25,
                color: woo_black,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              woo list
            </Text>
          </View>
        }
        leftContainerStyle={styles.leftComponent}
        centerContainerStyle={styles.centerComponent}
      />
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  header: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
    marginBottom: 5,
  },
  leftComponent: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerComponent: {
    justifyContent: "center",
    alignItems: "center",
  },
  rightComponent: {
    justifyContent: "center",
    alignItems: "center",
  },
  previewScroll: {},
  previewItem: {
    marginHorizontal: 5,
    alignItems: "center",
    width: 80,
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 4,
  },
  previewName: {
    fontSize: 12,
    textAlign: "center",
  },

  itemContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
  },
  itemImage: {
    width: "100%",
    height: 160,
    borderRadius: 10,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "600",
  },
  itemMeta: {
    fontSize: 14,
    color: "#555",
    marginVertical: 4,
  },
  claimRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  claimButton: {
    backgroundColor: "#1e90ff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  claimButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  claimedRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  claimedUser: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 6,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  claimedText: {
    fontSize: 12,
    color: "#333",
  },
  fullyClaimedText: {
    color: "red",
    fontStyle: "italic",
    marginTop: 8,
  },
  editBtn: {
    marginLeft: 6,
    paddingHorizontal: 4,
    backgroundColor: "#f0ad4e",
    borderRadius: 4,
  },
  editText: {
    color: "#fff",
    fontSize: 10,
  },

  removeBtn: {
    marginLeft: 4,
    paddingHorizontal: 4,
    backgroundColor: "#d9534f",
    borderRadius: 4,
  },
  removeText: {
    color: "#fff",
    fontSize: 10,
  },
});

export default WooListItems;
