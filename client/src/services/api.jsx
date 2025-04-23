import axios from "axios";
import toast from "react-hot-toast";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
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
export const registerUser = async (email, password, farmName) => {
  const { data } = await API.post("/auth/register", { email, password, farmName });
  return data;
};

export const loginUser = async (email, password) => {
  const { data } = await API.post("/auth/login", { email, password });
  return data;
};



export default API;
