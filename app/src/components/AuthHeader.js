import { StyleSheet, Text, View } from "react-native";
import React from "react";

const AuthHeader = ({ title, subtitle }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

export default AuthHeader;

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1E293B",
    marginTop: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    marginTop: 8,
    textAlign: "center",
    
  },
});
