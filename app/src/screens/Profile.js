import {
  StyleSheet,
  View,
  Image,
  ActivityIndicator,
  Text,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { getProfile } from "../utils/Auth";
import ProfileField from "../components/ProfileField";

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setProfile(await getProfile());
      setLoading(false);
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Image
          style={styles.profileImage}
          source={require("../../assets/images.png")}
        />
      </View>
      <View style={styles.body}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.card}>
            <ProfileField fieldName="Name" fieldValue={profile.name} />
            <ProfileField fieldName="Email" fieldValue={profile.email} />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Details</Text>
          <View style={styles.card}>
            <ProfileField
              fieldName="Specialty"
              fieldValue={profile.specialty}
            />
            <ProfileField
              fieldName="Patients"
              fieldValue={`${profile.patients?.length || 0}`}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
  },
  profileImage: {
    alignSelf: "center",
    width: 120,
    height: 120,
    borderRadius: 75,
    borderColor: "#007bff",
    borderWidth: 2,
    // shadowColor: "rgba(0, 0, 0, 0.1)",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.01,
    // shadowRadius: 6,
    // elevation: 5,
    // marginBottom: 20,
  },
  body: {
    marginTop: 25,
    paddingHorizontal: 10,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  card: {
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    padding: 8,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
    // elevation: 2,
  },
});
