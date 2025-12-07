import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { woo_black } from "../assets/colors";

{
  /* <UserCard
  user={u}
  isRow
  topLeft={<Icon name="star" />}
  topRight={<Icon name="more" />}
  side={<FollowButton profileId={u.id} />}
  footer={<Text>Footer ignored in isRow=true</Text>}
/> */
}

const UserCard = ({
  user,
  onPress,
  isRow = false,
  topLeft,
  topRight,
  footer,
  side,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, isRow && styles.cardRow]}
      onPress={() => onPress(user)}
    >
      {topLeft && <View style={styles.topLeft}>{topLeft}</View>}

      {topRight && <View style={styles.topRight}>{topRight}</View>}

      <Image
        source={{ uri: user.profile_pic_url }}
        style={[styles.avatar, isRow && styles.avatarRow]}
      />

      <View style={[styles.info, isRow && styles.infoRow]}>
        <Text style={styles.username}>@{user.username}</Text>
        <Text style={styles.name}>{user.name}</Text>
      </View>

      {isRow && side && <View style={styles.sideContainer}>{side}</View>}

      {!isRow && footer && <View style={styles.footerContainer}>{footer}</View>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    padding: 12,
    marginHorizontal: 0,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
  },

  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
    marginVertical: 5,
  },

  topLeft: {
    position: "absolute",
    top: 8,
    left: 8,
    zIndex: 10,
  },

  topRight: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
  },

  avatarRow: {
    marginBottom: 0,
    marginRight: 12,
  },

  info: {
    alignItems: "center",
    marginBottom: 8,
  },

  infoRow: {
    alignItems: "flex-start",
    marginBottom: 0,
    flex: 1,
  },

  username: {
    fontWeight: "bold",
    fontSize: 14,
    color: woo_black,
  },

  name: {
    color: "#777",
    fontSize: 12,
  },

  sideContainer: {
    marginLeft: "auto",
  },

  footerContainer: {
    marginTop: 8,
  },
});

export default UserCard;
