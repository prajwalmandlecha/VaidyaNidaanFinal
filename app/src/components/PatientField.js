import { StyleSheet, Text, View } from "react-native";

const PatientField = ({ fieldName, fieldValue }) => {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldName}>{fieldName}</Text>
      <Text style={styles.fieldValue}>{fieldValue}</Text>
    </View>
  );
};

export default PatientField;

const styles = StyleSheet.create({
  field: {
    flex: 1,
    backgroundColor: "white",
    borderColor: "#e0e0e0",
    width: "100%",
    borderRadius: 12,
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderColor: "rgba(0, 0, 0, 0.08)",
    borderWidth: 1,
    alignItems: "center",
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
