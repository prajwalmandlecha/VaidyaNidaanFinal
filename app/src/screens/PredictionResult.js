import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const PredictionResult = ({ navigation, route }) => {
  const { data, image } = route.params;
  console.log(image);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Prediction Result</Text>
      </View>
      <View style={styles.resultContainer}>
        <Text style={styles.resultlabel}>Non-Demented Probability:</Text>
        <Text style={styles.result}>
          {data.prediction.alzheimer_probability.toFixed(2)}
        </Text>
      </View>

      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} />
      </View>
    </SafeAreaView>
  );
};

export default PredictionResult;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 16,
  },
  header: { alignItems: "center", marginVertical: 24 },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1E293B",
    color: "#1E293B",
    letterSpacing: 0.5,
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
  imageContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 6,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    borderRadius: 8,
  },
});
