import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";

const AuthFooterLink = ({ footerText, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.footerLink}>{footerText}</Text>
    </TouchableOpacity>
  );
};

export default AuthFooterLink;

const styles = StyleSheet.create({
  footerLink: {
    color: "#07054a",
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});
