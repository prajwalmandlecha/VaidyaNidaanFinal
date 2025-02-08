import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

const AddPatientButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.addUserContainer}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <AntDesign
        name="adduser"
        size={25}
        color="#07054a"
        style={styles.addUserIcon}
      />
      <Text style={styles.addUserText}>Add Patient</Text>
    </TouchableOpacity>
  );
};

export default AddPatientButton;

const styles = StyleSheet.create({
  addUserContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#E2E8F0",
    width: "100%",
    // shadowColor: "#000",
    // shadowOpacity: 0.1,
    // shadowRadius: 6,
    // elevation: 3,
    marginBottom: 10,
    height: 48,
  },
  addUserIcon: {
    marginRight: 10,
  },
  addUserText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#07054a",
  },
});
