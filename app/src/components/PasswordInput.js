import { StyleSheet, TextInput, View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const PasswordInput = ({ password, setPassword, placeholder }) => {
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View
      style={[styles.inputContainer, passwordFocused && styles.inputFocused]}
    >
      <Ionicons
        name="lock-closed-outline"
        size={20}
        color="#64748B"
        style={styles.inputIcon}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor="#94A3B8"
        placeholder={placeholder}
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        secureTextEntry={!showPassword}
        onFocus={() => setPasswordFocused(true)}
        onBlur={() => setPasswordFocused(false)}
      />
      <TouchableOpacity
        onPress={() => setShowPassword(!showPassword)}
        style={styles.eyeIcon}
      >
        <Ionicons
          name={showPassword ? "eye-off" : "eye"}
          size={20}
          color="#64748B"
        />
      </TouchableOpacity>
    </View>
  );
};

export default PasswordInput;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
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
  eyeIcon: {
    position: "absolute",
    right: 16,
  },
});
