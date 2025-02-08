import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Heatmap = ({ navigation, route }) => {
  const { originalImage, heatmapImage } = route.params;
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>GradCam Heatmap</Text>
      <Image source={{ uri: originalImage }} style={styles.image} />
      <Image source={{ uri: heatmapImage }} style={styles.image} />
    </SafeAreaView>
  );
};

export default Heatmap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    margin: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
  image: {
    flex: 1,
    width: "100%",
    margin: 16,
    resizeMode: "contain",
  },
});
