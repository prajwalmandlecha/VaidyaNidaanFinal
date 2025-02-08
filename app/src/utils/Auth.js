import * as SecureStore from "expo-secure-store";
import api from "../services/apiService";

export const signUp = async (
  name,
  specialty,
  email,
  password,
  confirmPassword,
  setLoading
) => {
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }
  if (!name || !specialty || !email || !password || !confirmPassword) {
    alert("Please fill in all the fields");
    return;
  }
  setLoading(true);
  try {
    console.log("Signing up...");
    const response = await api.post("/doctors/signup", {
      email,
      password,
      name,
      specialty,
    });
    console.log(response);
    alert("Sign Up successful! Let's Login");
  } catch (error) {
    alert(error.response.data.message);
  } finally {
    setLoading(false);
  }
};

export const handleLogin = async (email, password, setLoading, setUser) => {
  if (!email || !password) {
    alert("Please fill in all the fields");
    return;
  }
  setLoading(true);
  try {
    console.log("Logging in...");
    const response = await api.post("/doctors/login", {
      email,
      password,
    });
    const { token, user, message } = response.data;
    console.log(message, "user: ", user);
    setUser({
      token: token,
      userData: user,
    });
    await SecureStore.setItemAsync("jwt", token);
  } catch (error) {
    alert(error.response.data.message);
  } finally {
    setLoading(false);
  }
};

export const getProfile = async () => {
  const response = await api.get("/doctors/profile");
  console.log("Profile", response.data);
  return response.data;
};
