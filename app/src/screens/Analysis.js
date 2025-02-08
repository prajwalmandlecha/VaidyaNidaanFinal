import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { uploadApi } from "../services/apiService";
import { gradcam, prediction } from "../utils/Patients";

const GradCamDetection = ({ navigation, route }) => {
  const { patient } = route.params;
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: ["image/png", "image/jpeg", "image/jpg"],
    });
    if (!result.canceled) {
      setSelectedFile(result.assets[0]);
    }
  };

  const getHeatmap = async (file) => {
    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      type: file.mimeType,
      name: file.name,
    });

    try {
      const [heatmapResponse, predictionResponse] = await Promise.all([
        gradcam(patient.id, formData),
        prediction(patient.id, formData),
      ]);
      console.log("Upload successful:", heatmapResponse, predictionResponse);
      if (heatmapResponse && predictionResponse) {
        navigation.navigate("Result", {
          predictionData: predictionResponse,
          originalImage: heatmapResponse.mriUrl,
          heatmapImage: heatmapResponse.heatmapUrl,
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  const detectMRI = async (selectedFile) => {
    setLoading(true);
    getHeatmap(selectedFile);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Analyse MRI Scan for Alzheimer's</Text>
      {/* {      <Text style={styles.subtitle}>Supported format: Image</Text> */}

      <TouchableOpacity onPress={pickDocument} style={styles.uploadButton}>
        <Ionicons name="document-attach" size={24} color="#07054A" />
        <Text style={styles.buttonText}>
          {selectedFile ? "Replace File" : "Choose File"}
        </Text>
      </TouchableOpacity>

      {selectedFile && (
        <View style={styles.fileInfo}>
          {/* <Image
            source={{ uri: selectedFile.uri }}
            style={{ height: "100%", width: "100%", resizeMode: "contain" }}
          /> */}
          <Ionicons name="document-text" size={20} color="#64748B" />
          <View style={styles.fileDetails}>
            <Text style={styles.fileName} numberOfLines={1}>
              {selectedFile.name}
            </Text>
            <Text style={styles.fileSize}>
              {(selectedFile.size / 1024).toFixed(2)} KB
            </Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.analyseButton,
          !selectedFile && styles.disabledButton,
          loading && styles.disabledButton,
        ]}
        onPress={() => detectMRI(selectedFile)}
        disabledButton={loading || !selectedFile}
      >
        {loading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text style={styles.analyseButtonText}>Analyse</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default GradCamDetection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    marginBottom: 32,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderColor: "rgba(0, 0, 0, 0.08)",
    borderWidth: 1,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.05,
    // shadowRadius: 6,
    // elevation: 2,
    marginBottom: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#07054a",
    marginLeft: 12,
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    marginBottom: 24,
  },
  fileDetails: {
    marginLeft: 12,
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    color: "#1E293B",
    fontWeight: "500",
  },
  fileSize: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },
  analyseButton: {
    backgroundColor: "#07054A",
    borderRadius: 12,
    padding: 18,
    width: "100%",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#E2E8F0",
  },
  analyseButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
});
