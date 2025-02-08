import { StyleSheet, TextInput, View } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const EmailInput = ({ email, setEmail }) => {
  const [emailFocused, setEmailFocused] = useState(false);

  return (
    <View style={[styles.inputContainer, emailFocused && styles.inputFocused]}>
      <Ionicons
        name="mail-outline"
        size={20}
        color="#64748B"
        style={styles.inputIcon}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor="#94A3B8"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        onFocus={() => setEmailFocused(true)}
        onBlur={() => setEmailFocused(false)}
      />
    </View>
  );
};

export default EmailInput;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
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
