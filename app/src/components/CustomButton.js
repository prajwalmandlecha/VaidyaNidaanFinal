import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";

const CustomButton = ({ buttonText, loading, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.button, loading && styles.disabledButton]}
      activeOpacity={0.8}
      disabled={loading}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.buttonText}>{buttonText}</Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#07054a",
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 12,
    marginTop: 18,
  },
  disabledButton: {
    backgroundColor: "#B0B3C6",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
