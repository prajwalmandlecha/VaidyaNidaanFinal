import { View, StyleSheet } from "react-native";
import { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Logo from "../components/Logo";
import EmailInput from "../components/EmailInput";
import PasswordInput from "../components/PasswordInput";
import AuthButton from "../components/AuthButton";
import AuthFooterLink from "../components/AuthFooterLink";

import { handleLogin } from "../utils/Auth";
import { UserContext } from "../context/UserContext";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.contentContainer}
        enableOnAndroid={true}
        extraScrollHeight={30}
        enableAutomaticScroll={true}
        showsVerticalScrollIndicator={false}
      >
        <Logo height={250} width={250} />
        <EmailInput email={email} setEmail={setEmail} />
        <PasswordInput
          password={password}
          setPassword={setPassword}
          placeholder={"Password"}
        />
        <AuthButton
          buttonText="Sign In"
          loading={loading}
          onPress={() => handleLogin(email, password, setLoading, setUser)}
        />
        <View style={styles.footer}>
          <AuthFooterLink footerText={"Forgot Password"} onPress={() => {}} />
          <AuthFooterLink
            footerText={"Create Account"}
            onPress={() => {
              navigation.navigate("SignUp");
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 30,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 100,
    justifyContent: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    paddingHorizontal: 8,
  },
});
