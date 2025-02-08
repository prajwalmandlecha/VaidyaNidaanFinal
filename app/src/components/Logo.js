import { StyleSheet, View, Image } from "react-native";

const Logo = () => {
  return (
    <View style={styles.logoContainer}>
      <Image
        style={styles.logoIcon}
        source={require("../../assets/logo.png")}
        resizeMode="contain"
      />
    </View>
  );
};

export default Logo;

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoIcon: {
    width: 250,
    height: 250,
    borderRadius: 16,
  },
});
