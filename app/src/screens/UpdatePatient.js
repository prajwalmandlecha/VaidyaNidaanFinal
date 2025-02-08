import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useState } from "react";
import CustomTextInput from "../components/CustomTextInput";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/CustomButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CustomDropdown from "../components/DropDown";
import { updatePatient } from "../utils/Patients";

const UpdatePatient = ({ navigation, route }) => {
  const patient = route.params.patient;
  const genders = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];
  const isSmoker = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];
  const hasNeurologicalCondition = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];
  const alchoholConsumptionAmount = [
    {
      label: "Never",
      value: "Never",
    },
    {
      label: "Low",
      value: "Low",
    },
    {
      label: "High",
      value: "High",
    },
  ];
  const [gender, setGender] = useState(patient.gender);
  const [name, setName] = useState(patient.name);
  const [age, setAge] = useState(`${patient.age}`);
  const [smoker, setSmoker] = useState(patient.smoker);
  const [loading, setLoading] = useState(false);
  const [alcoholConsumption, setAlcoholConsumption] = useState(
    patient.alcoholConsumption
  );
  const [neurologicalCondition, setNeurologicalCondition] = useState(
    patient.neurologicalCondition
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.contentContainer}
        enableOnAndroid={true}
        extraScrollHeight={30}
        enableAutomaticScroll={true}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Update Patient</Text>
        </View>
        <View style={styles.form}>
          <CustomTextInput
            placeholder="Name"
            iconName={"person"}
            value={name}
            setValue={setName}
          />
          <CustomTextInput
            placeholder="Age"
            iconName={"calendar"}
            value={age}
            setValue={setAge}
          />
          <CustomDropdown
            value={gender}
            setValue={setGender}
            data={genders}
            placeholder={"Select Gender"}
          />
          <CustomDropdown
            value={smoker}
            setValue={setSmoker}
            data={isSmoker}
            placeholder={"Smoker?"}
          />
          <CustomDropdown
            value={alcoholConsumption}
            setValue={setAlcoholConsumption}
            data={alchoholConsumptionAmount}
            placeholder={"Alcohol Consumption"}
          />
          <CustomDropdown
            value={neurologicalCondition}
            setValue={setNeurologicalCondition}
            data={hasNeurologicalCondition}
            placeholder={"Neurological Condition?"}
          />
          <CustomButton
            buttonText="Update Patient"
            onPress={() => {
              updatePatient(
                patient.id,
                name,
                gender,
                age,
                smoker,
                alcoholConsumption,
                neurologicalCondition
              );
            }}
            loading={loading}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default UpdatePatient;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: "#F8FAFC",
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 100,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
  },
});
