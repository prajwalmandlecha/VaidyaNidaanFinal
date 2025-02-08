import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather";

const InfoField = ({ fieldName, fieldValue }) => {
  return (
    <View style={styles.field}>
      <View>
        <Text style={styles.fieldName}>{fieldName}</Text>
        <Text style={styles.fieldValue}>{fieldValue}</Text>
      </View>
      <TouchableOpacity style={styles.editContainer}>
        <Feather name="edit-2" size={18} color="blue" />
      </TouchableOpacity>
    </View>
  );
};

export default InfoField;

const styles = StyleSheet.create({
  field: {
    backgroundColor: "white",
    borderColor: "#e0e0e0",
    width: "100%",
    borderRadius: 12,
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  fieldName: {
    fontWeight: "600",
    color: "#6c757d",
    fontSize: 14,
  },
  fieldValue: {
    marginTop: 6,
    fontSize: 16,
    color: "#07054a",
    fontWeight: "500",
  },
  editContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
