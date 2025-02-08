import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import Search from "../components/Search";
import PatientList from "../components/PatientList";
import { FAB } from "@rneui/themed";
import { getPatients } from "../utils/Patients";
import { shadow } from "react-native-paper";

const Home = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState([]);
  const [filteredData, setFilteredData] = useState(patientData);

  useEffect(() => {
    const fetchPatients = async () => {
      const data = await getPatients();
      setPatientData(data.patients);
      setFilteredData(data.patients);
      setLoading(false);
    };
    fetchPatients();
  }, [navigation]);

  if (loading) {
    return (
      <View
        style={{
          ...styles.container,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#07054A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Search data={patientData} setFilteredData={setFilteredData} />
      </View>
      <View style={styles.list}>
        <PatientList data={filteredData} navigation={navigation} />
      </View>
      <FAB
        placement="right"
        color="white"
        icon={{
          name: "adduser",
          color: "#07054A",
          type: "antdesign",
          size: 30,
        }}
        title="Add Patient"
        titleStyle={{ color: "#07054A", fontSize: 16, fontWeight: "bold" }}
        onPress={() => navigation.navigate("Add Patient")}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
    paddingBottom: 0,
  },
  header: {
    marginBottom: 8,
  },
  list: {
    flex: 1,
    marginTop: 16,
    overflow: "hidden",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
  },
});
