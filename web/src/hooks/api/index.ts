// lib/axios.ts
import axios from "axios";
const SERVER_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

const API_BASE_URL = "https://property-management-system-0uoy.onrender.com"; // Hardcoded temporarily

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 20_000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // handle errors globally
    console.error("API error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);
