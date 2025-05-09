import axios from "axios";
import toast from "react-hot-toast";

const API = axios.create({
  baseURL: window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api'  // Local backend during development
    : '/api'  // For Vercel production (relative to the deployed app)
});


// Automatically attach token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || "Something went wrong. Please try again.";
    toast.error(message);
    return Promise.reject(error);
  }
);

// --- Auth ---
export const registerUser = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await API.post("/auth/login", userData);
  return response.data;
};

export const fetchUserProfile = async (token) => {
  const response = await API.get("/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default API;
