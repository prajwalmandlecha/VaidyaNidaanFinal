// src/services/apiService.js
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const BASE_URL = "http://192.168.130.8:5005/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const fileApi = axios.create({
  baseURL: "http://192.168.130.8:5005/api",
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export const chatbotApi = axios.create({
  baseURL: "http://192.168.130.8:5005/chatbot",
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
