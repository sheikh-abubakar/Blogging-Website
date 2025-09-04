import axios from "axios";

// Use relative paths for API when deployed
const api = axios.create({
  baseURL: import.meta.env.DEV 
    ? import.meta.env.VITE_API_URL 
    : "/api" // In production, API is at /api path
});

// Add better error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;