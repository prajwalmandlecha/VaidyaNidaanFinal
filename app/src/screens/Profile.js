import { StyleSheet, View, Image, ActivityIndicator } from "react-native";
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
    <View style={styles.container}>
      <Image
        style={styles.profileImage}
        source={require("../../assets/images.png")}
      />
      <View style={styles.body}>
        <ProfileField fieldName="Name: " fieldValue={profile.name} />
        <ProfileField fieldName="Specialty: " fieldValue={profile.specialty} />
        <ProfileField fieldName="Email: " fieldValue={profile.email} />
        {/*<Text>No. of patients: {profile.patients.length}</Text>*/}
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  profileImage: {
    alignSelf: "center",
    width: 150,
    height: 150,
    borderRadius: 75,
    borderColor: "#007bff",
    borderWidth: 2,
    // shadowColor: "#000",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
});
