import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Result = ({ navigation, route }) => {
  const { originalImage, heatmapImage, predictionData } = route.params;
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>MRI Analysis</Text>
      <View style={styles.resultContainer}>
        <Text style={styles.resultlabel}>Non-Demented Probability:</Text>
        <Text style={styles.result}>
          {predictionData?.prediction.alzheimer_probability.toFixed(2)}
        </Text>
      </View>
      <Image source={{ uri: originalImage }} style={styles.image} />
      <Image source={{ uri: heatmapImage }} style={styles.image} />
    </SafeAreaView>
  );
};

export default Result;

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
  resultContainer: {
    alignItems: "center",
  },
  resultlabel: {
    fontSize: 18,
    color: "#64748B",
    textAlign: "center",
  },
  result: {
    fontSize: 36,
    fontWeight: "700",
    color: "#07054a",
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    margin: 16,
    resizeMode: "contain",
  },
});
