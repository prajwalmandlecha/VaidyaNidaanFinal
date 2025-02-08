import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather";

const renderPatient = ({ item, handlePatientPress, navigation }) => {
  return (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => handlePatientPress(item)}
    >
      {/* <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </View> */}
      <View style={styles.userInfo}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {item.name}
        </Text>
        <View style={styles.subtext}>
          <Text style={styles.gender}>{item.gender}</Text>
          <Text style={styles.age}>{item.age} years</Text>
        </View>
      </View>
      <View style={styles.iconContainer}>
        <Feather
          name="chevron-right"
          size={24}
          color="#A0A3B1"
          style={styles.icon}
        />
      </View>
    </TouchableOpacity>
  );
};

const PatientList = ({ data, navigation }) => {
  console.log("Data", data);
  const handlePatientPress = (patient) => {
    navigation.navigate("PatientPage", { patient });
  };
  return (
    <View>
      <FlatList
        data={data}
        renderItem={(props) =>
          renderPatient({ ...props, handlePatientPress, navigation })
        }
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default PatientList;

const styles = StyleSheet.create({
  userItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#F1F5F9",
    borderWidth: 1,
    marginVertical: 8,
  },
  userInfo: {
    flex: 1,
    marginRight: 12,
  },
  // imageContainer: {
  //   padding: 10,
  // },
  // image: {
  //   width: 56,
  //   height: 56,
  //   marginRight: 10,
  //   borderRadius: 28,
  //   borderColor: "#E2E8F0",
  //   borderWidth: 2,
  // },

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
    maxWidth: "90%",
    marginBottom: 8,
  },
  age: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  gender: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  iconContainer: {
    marginLeft: 8,
    justifyContent: "center",
  },
  icon: {},
  subtext: {
    flexDirection: "row",
    gap: 32,
    alignItems: "center",
  },
});
