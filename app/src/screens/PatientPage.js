import { StyleSheet, Text, View, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileField from "../components/ProfileField";
import PatientButtons from "../components/PatientButtons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { deletePatient } from "../utils/Patients";
import PatientField from "../components/PatientField";

const PatientPage = ({ navigation, route }) => {
  const { patient } = route.params;

  const handleDelete = (id) => {
    deletePatient(patient.id);
    alert("Patient data deleted successfully");
    navigation.navigate("Main");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.contentContainer}
        enableOnAndroid={true}
        extraScrollHeight={30}
        enableAutomaticScroll={true}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Patient Profile</Text>
        </View>
        <View style={styles.buttonContainer}>
          <PatientButtons
            buttonText={"Analyse MRI"}
            onPress={() => navigation.navigate("MRI Analysis", { patient })}
          />
        </View>
        <View style={styles.card}>
          <PatientField fieldName={"Name: "} fieldValue={patient.name} />
          <PatientField
            fieldName={"Age: "}
            fieldValue={patient.age + " Years"}
          />
          <PatientField fieldName={"Gender"} fieldValue={patient.gender} />
          <PatientField fieldName={"Smoker: "} fieldValue={patient.smoker} />
          <PatientField
            fieldName={"Alcohol Consumption: "}
            fieldValue={patient.alcoholConsumption}
          />
          <PatientField
            fieldName={"Neurological Condition: "}
            fieldValue={patient.neurologicalCondition}
          />
          <PatientField
            fieldName={"Created on: "}
            fieldValue={patient.createdAt.split("T")[0]}
          />
          <PatientField
            fieldName={"Updated on: "}
            fieldValue={patient.updatedAt.split("T")[0]}
          />
        </View>
        <View style={styles.bottomButtonContainer}>
          <PatientButtons
            buttonText="Edit"
            onPress={() => navigation.navigate("Update Patient", { patient })}
          />
          <PatientButtons
            buttonText="Delete"
            onPress={() => handleDelete(patient.id)}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default PatientPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 30,
    paddingHorizontal: 30,
    backgroundColor: "#F8FAFC",
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    flex: 1,
    alignItems: "left",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 16,
    alignSelf: "center",
  },
  bottomButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
