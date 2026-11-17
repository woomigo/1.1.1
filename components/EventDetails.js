import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import MapView, { Marker } from "react-native-maps";
import {
  woo_black,
  woo_orange,
  woo_white,
  woo_medium_gray,
  woo_gray,
  woo_light_gray,
} from "../assets/colors";
import { getFormattedTime, getMonthAndDay } from "./utility";

const EventDetails = ({ woo }) => {
  const location = woo.item.location;
  const region = location.region;

  const { month, day } = getMonthAndDay(woo.item.start_date);
  const wooStartTime = getFormattedTime(woo.item.start_time);
  const wooEndTime = getFormattedTime(woo.item.end_time);

  const openInMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      location.address,
    )}`;

    Linking.openURL(url).catch(() => undefined);
  };

  return (
    <View style={styles.container}>
      <DetailRow icon="calendar" label="Date" value={`${month} ${day}`} />

      <DetailRow
        icon="clock"
        label="Time"
        value={`${wooStartTime} - ${wooEndTime}`}
      />

      <Pressable
        onPress={openInMaps}
        accessibilityRole="link"
        accessibilityLabel={`Open ${location.address} in maps`}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <DetailRow
          icon="location-dot"
          label="Location"
          value={location.address}
        />

        <MapView
          style={styles.map}
          region={region}
          initialRegion={region}
          scrollEnabled={false}
          zoomEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
          pointerEvents="none"
        >
          <Marker coordinate={region} title={location.address} />
        </MapView>
      </Pressable>
    </View>
  );
};

const DetailRow = ({ icon, label, value }) => {
  return (
    <View style={styles.row}>
      <View style={styles.iconTile}>
        <FontAwesome6Icon name={icon} size={20} color={woo_orange} />
      </View>

      <View style={styles.rowText}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: woo_light_gray,
    alignItems: "center",
    justifyContent: "center",
  },
  rowText: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: woo_black,
    opacity: 0.6,
  },
  value: {
    fontSize: 15,
    fontWeight: "bold",
    color: woo_black,
    lineHeight: 21,
  },
  map: {
    width: "100%",
    height: 160,
    borderRadius: 10,
    marginTop: 10,
  },
  pressed: {
    opacity: 0.85,
  },
});

export default EventDetails;
