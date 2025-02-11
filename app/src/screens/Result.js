import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import PatientField from "../components/PatientField";
import ProfileField from "../components/ProfileField";
import Markdown from "react-native-markdown-display";

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
        <Text style={styles.resultlabel}>Original Image</Text>
        <Image source={{ uri: originalImage }} style={styles.image} />
        <Text style={styles.resultlabel}>HeatMap Image</Text>
        <Image source={{ uri: heatmapImage }} style={styles.image} />
        <View>
          <PatientField
            fieldName={"Brain Volume (mm³): "}
            fieldValue={fslData.data.basic.brain_volume_mm3}
          />
          <PatientField
            fieldName={"Max Intensity:"}
            fieldValue={fslData.data.basic.max_intensity}
          />
          <PatientField
            fieldName={"Mean Intensity:"}
            fieldValue={fslData.data.basic.mean_intensity}
          />
          <PatientField
            fieldName={"Median Intensity:"}
            fieldValue={fslData.data.basic.median_intensity}
          />
          <PatientField
            fieldName={"Min Intensity:"}
            fieldValue={fslData.data.basic.min_intensity}
          />
          <PatientField
            fieldName={"Standard Deviation:"}
            fieldValue={fslData.data.basic.std_deviation}
          />
          <ProfileField
            fieldName={"CerebroSpinal Fluid Volume (mm³):"}
            fieldValue={fslData.data.tissue_volumes.csf_mm3}
          />
          <PatientField
            fieldName={"Grey Matter Volume (mm³):"}
            fieldValue={fslData.data.tissue_volumes.gm_mm3}
          />
          <PatientField
            fieldName={"White Matter Volume (mm³):"}
            fieldValue={fslData.data.tissue_volumes.wm_mm3}
          />
        </View>
        <View style={styles.plainTextContainer}>
          <Text style={styles.plainHeading}>Medical Interpretation</Text>
          <Text style={styles.plainListItem}>
            • Normal brain tissue usually exhibits intensity values within a
            specific range.
          </Text>
          <Text style={styles.plainListItem}>
            • Regions with unusually high intensities may indicate lesions or
            abnormal growth.
          </Text>
          <Text style={styles.plainListItem}>
            • Lower mean intensities could be associated with atrophy or
            degeneration.
          </Text>
          <Text style={styles.plainHeading}>Recommendation</Text>
          <Text style={styles.plainListItem}>
            • If any abnormalities are suspected, further evaluation (e.g., with
            additional radiological studies or a neurologist consultation) is
            advised.
          </Text>
        </View>
        {/* <View style={styles.resultContainer}> */}
        {/* <Text style={styles.resultlabel}>Brain Volume (mm³):</Text>
          <Text style={styles.result}>
            {fslData.data.basic.brain_volume_mm3}
          </Text> */}
        {/* <Text style={styles.resultlabel}>Max Intensity:</Text>
          <Text style={styles.result}>{fslData.data.basic.max_intensity}</Text> */}
        {/* <Text style={styles.resultlabel}>Mean Intensity:</Text>
          <Text style={styles.result}>{fslData.data.basic.mean_intensity}</Text> */}
        {/* <Text style={styles.resultlabel}>Median Intensity:</Text>
          <Text style={styles.result}>
            {fslData.data.basic.median_intensity}
          </Text>
          <Text style={styles.resultlabel}>Min Intensity:</Text> */}
        {/* <Text style={styles.result}>{fslData.data.basic.min_intensity}</Text> */}
        {/* <Text style={styles.resultlabel}>Standard Deviation:</Text>
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
          </Text> */}
        {/* </View> */}
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
    padding: 12,
  },
  title: {
    fontSize: 24,
    margin: 16,
    fontWeight: "600",
    color: "#1E293B",
    textAlign: "center",
  },
  resultContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  resultlabel: {
    fontSize: 18,
    color: ",64748B",
    textAlign: "center",
  },
  result: {
    fontSize: 36,
    fontWeight: "700",
    color: "#07054a",
  },
  image: {
    flex: 1,
    width: 250,
    height: 250,
    margin: 16,
    resizeMode: "contain",
    alignSelf: "center",
  },
  plainTextContainer: {
    marginTop: 16,
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    marginHorizontal: 16,
  },
  plainHeading: {
    color: "#07054a",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  plainListItem: {
    color: "#1E293B",
    fontSize: 16,
    marginBottom: 4,
    lineHeight: 24,
  },
});
