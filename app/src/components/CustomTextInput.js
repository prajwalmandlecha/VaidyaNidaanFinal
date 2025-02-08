import { StyleSheet, TextInput, View } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const CustomTextInput = ({ placeholder, value, setValue, iconName }) => {
  const [fieldFocused, setFieldFocused] = useState(false);

  return (
    <View style={[styles.inputContainer, fieldFocused && styles.inputFocused]}>
      <Ionicons
        name={iconName}
        size={20}
        color="#64748B"
        style={styles.inputIcon}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor="#94A3B8"
        placeholder={placeholder}
        value={value}
        onChangeText={setValue}
        keyboardType="default"
        onFocus={() => setFieldFocused(true)}
        onBlur={() => setFieldFocused(false)}
      />
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  input: {
    flex: 1,
    color: "#1E293B",
    paddingVertical: 16,
    paddingRight: 40,
  },
  inputFocused: {
    borderColor: "#07054a",
  },
  inputIcon: {
    marginRight: 12,
  },
});
