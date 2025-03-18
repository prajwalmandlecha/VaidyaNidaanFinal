// src/services/apiService.js
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const fileApi = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export const chatbotApi = axios.create({
  baseURL: `${BASE_URL}/chatbot`,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItem("jwt");
    console.log("interceptor token: ", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
