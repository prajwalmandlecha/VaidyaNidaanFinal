import { StyleSheet, View, Image } from "react-native";

const Logo = ({ height, width }) => {
  return (
    <View style={styles.logoContainer}>
      <Image
        style={{ ...styles.logoIcon, height, width }}
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
    borderRadius: 16,
  },
});
