import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

const PatientButtons = ({ onPress, buttonText }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

export default PatientButtons;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#07054a",
    padding: 12,
    borderRadius: 12,
    // shadowColor: "black",
    // elevation: 4,
    // shadowOpacity: 0.1,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 12,
    margin: 6,
    flex: 1,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
