import { useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  UIManager,
  findNodeHandle,
} from "react-native";
import { woo_black } from "../assets/colors";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";

const EllipsisMenu = ({ options = [], type, size }) => {
  const [visible, setVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const buttonRef = useRef(null);

  const openMenu = () => {
    const node = findNodeHandle(buttonRef.current);
    UIManager.measure(node, (x, y, width, height, pageX, pageY) => {
      setMenuPosition({
        top: pageY + height,
        left: pageX - 120 + width, // adjust based on menu width
      });
      setVisible(true);
    });
  };

  return (
    <View>
      <TouchableOpacity
        disabled={!options || options.length === 0}
        ref={buttonRef}
        onPress={openMenu}
        style={{ opacity: options?.length ? 1 : 0.4 }}
      >
        <FontAwesome6Icon
          name={type == "vertical" ? "ellipsis-vertical" : "ellipsis"}
          size={size ?? 20}
          color={woo_black}
        />
      </TouchableOpacity>

      <Modal transparent visible={visible} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.overlay}>
            <View
              style={[
                styles.menu,
                { top: menuPosition.top, left: menuPosition.left },
              ]}
            >
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => {
                    setVisible(false);
                    option.onPress();
                  }}
                >
                  <View style={styles.menuItemContent}>
                    {option.icon && (
                      <FontAwesome6Icon
                        name={option.icon}
                        size={16}
                        color={option.destructive ? "#D32F2F" : "#444"}
                        style={styles.menuIcon}
                      />
                    )}
                    <Text
                      style={[
                        styles.menuText,
                        option.destructive && { color: "#D32F2F" },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  menu: {
    position: "absolute",
    width: 160,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 8,

    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,

    // Android Shadow
    elevation: 8,

    // Optional subtle border for extra separation
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.08)",
  },
  menuItem: {
    padding: 20,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  menuIcon: {
    marginRight: 12,
  },

  menuText: {
    fontSize: 15,
    color: "#333",
  },
});

export default EllipsisMenu;
