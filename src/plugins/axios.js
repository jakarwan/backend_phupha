// src/plugins/axios.ts
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const api = axios.create({
  // baseURL: "http://localhost:3000/api",
  baseURL: "https://api.phupha-help.com/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// api.interceptors.request.use((config) => {
//   const auth = useAuthStore();
//   if (auth.token) {
//     config.headers.Authorization = `Bearer ${auth.token}`;
//   }
//   return config;
// });

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.status === false) {
      const auth = useAuthStore();
      auth.logout();
      return Promise.reject(
        new Error(response.data.message || "เกิดข้อผิดพลาด")
      );
    }
    return response;
  },
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      const auth = useAuthStore();
      auth.logout();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
