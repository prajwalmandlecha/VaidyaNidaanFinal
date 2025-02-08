import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const LogOutLink = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.iconContainer}
      hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
    >
      <MaterialIcons name="logout" size={24} color="#07054A" />
    </TouchableOpacity>
  );
};

export default LogOutLink;

const styles = StyleSheet.create({
  iconContainer: {
    marginRight: 8,
    marginTop: 0,
    justifyContent: "center",
    alignItems: "flex-end",
    padding: 8,
    //backgroundColor: "#f0f0f0",
    borderRadius: 8,
    height: 40,
  },
});
