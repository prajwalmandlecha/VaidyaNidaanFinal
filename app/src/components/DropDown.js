import React from "react";
import { StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const CustomDropdown = ({ value, setValue, data,placeholder }) => {
  return (
    <View style={styles.container}>
      <Dropdown
        data={data}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={value}
        onChange={(item) => setValue(item.value)}
        style={styles.dropdown}
        placeholderStyle={styles.placeholderText}
        selectedTextStyle={styles.selectedText}
        containerStyle={styles.dropdownContainer}
        itemTextStyle={styles.itemText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  dropdownContainer: {
    borderRadius: 12,
  },
  dropdown: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  selectedText: {
    color: "#1E293B",
  },
  placeholderText: {
    color: "#9CA3AF",
  },
  itemText: {
    color: "#1E293B",
  },
});

export default CustomDropdown;
