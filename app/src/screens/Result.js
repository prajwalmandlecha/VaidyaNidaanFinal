import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import PatientField from "../components/PatientField";

const Result = ({ navigation, route }) => {
  const { originalImage, heatmapImage, predictionData, fslData } = route.params;
  console.log(fslData);
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.contentContainer}
        enableOnAndroid={true}
        extraScrollHeight={30}
        enableAutomaticScroll={true}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>MRI Analysis</Text>
        <View style={styles.resultContainer}>
          <Text style={styles.resultlabel}>
            {predictionData.prediction.category}
          </Text>
          <Text style={styles.result}>
            {predictionData.prediction.confidence.toFixed(2)}
          </Text>
        </View>
        <Image source={{ uri: originalImage }} style={styles.image} />
        <Image source={{ uri: heatmapImage }} style={styles.image} />
        <View style={styles.resultContainer}>
          <Text style={styles.resultlabel}>Brain Volume (mm³):</Text>
          <Text style={styles.result}>
            {fslData.data.basic.brain_volume_mm3}
          </Text>
          <Text style={styles.resultlabel}>Max Intensity:</Text>
          <Text style={styles.result}>{fslData.data.basic.max_intensity}</Text>
          <Text style={styles.resultlabel}>Mean Intensity:</Text>
          <Text style={styles.result}>{fslData.data.basic.mean_intensity}</Text>
          <Text style={styles.resultlabel}>Median Intensity:</Text>
          <Text style={styles.result}>
            {fslData.data.basic.median_intensity}
          </Text>
          <Text style={styles.resultlabel}>Min Intensity:</Text>
          <Text style={styles.result}>{fslData.data.basic.min_intensity}</Text>
          <Text style={styles.resultlabel}>Standard Deviation:</Text>
          <Text style={styles.result}>{fslData.data.basic.std_deviation}</Text>
          <Text style={styles.resultlabel}>CSF Volume (mm³):</Text>
          <Text style={styles.result}>
            {fslData.data.tissue_volumes.csf_mm3}
          </Text>
          <Text style={styles.resultlabel}>GM Volume (mm³):</Text>
          <Text style={styles.result}>
            {fslData.data.tissue_volumes.gm_mm3}
          </Text>
          <Text style={styles.resultlabel}>WM Volume (mm³):</Text>
          <Text style={styles.result}>
            {fslData.data.tissue_volumes.wm_mm3}
          </Text>
        </View>
      </KeyboardAwareScrollView>
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
    marginBottom: 16,
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
    width: 300,
    height: 300,
    margin: 16,
    resizeMode: "contain",
  },
});
