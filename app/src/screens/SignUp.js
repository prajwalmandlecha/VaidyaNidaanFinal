import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useState } from "react";

import Logo from "../components/Logo";
import AuthHeader from "../components/AuthHeader";
import EmailInput from "../components/EmailInput";
import PasswordInput from "../components/PasswordInput";
import AuthButton from "../components/AuthButton";
import AuthFooterLink from "../components/AuthFooterLink";

import { signUp } from "../utils/Auth";
import CustomTextInput from "../components/CustomTextInput";

const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    await signUp(name, specialty, email, password, confirmPassword, setLoading);
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.contentContainer}
        enableOnAndroid={true}
        extraScrollHeight={30}
        enableAutomaticScroll={true}
        showsVerticalScrollIndicator={false}
      >
        <Logo height={200} width={200} />
        <CustomTextInput
          value={name}
          setValue={setName}
          iconName={"person"}
          placeholder={"Full Name"}
        />
        <CustomTextInput
          value={specialty}
          setValue={setSpecialty}
          iconName={"medkit"}
          placeholder={"Specialty"}
        />
        <EmailInput email={email} setEmail={setEmail} />
        <PasswordInput
          password={password}
          setPassword={setPassword}
          placeholder={"Password"}
        />
        <PasswordInput
          password={confirmPassword}
          setPassword={setConfirmPassword}
          placeholder={"Confirm Password"}
        />
        <AuthButton
          buttonText="Sign Up"
          loading={loading}
          onPress={handleSignUp}
        />
        <View style={styles.footer}>
          <AuthFooterLink
            footerText={"Already have an account?"}
            onPress={() => {
              navigation.navigate("Login");
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: "white",
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 100,
    justifyContent: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 24,
    paddingHorizontal: 8,
  },
});
