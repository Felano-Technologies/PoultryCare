import axios from "axios";
import toast from "react-hot-toast";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  // baseURL: "http://172.20.10.2:5000/api",
  // baseURL: "https://poultrycare.onrender.com/api",
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

// --- Flocks ---

// Create/Register a new flock
export const registerFlock = async (flockData) => {
  const response = await API.post("/flocks", flockData);
  return response.data;
};

// Get all flocks for the logged-in user
export const fetchFlocks = async () => {
  const response = await API.get("/flocks");
  return response.data;
};

export const fetchFlockStatusCounts = async () => {
  const response = await API.get('/flocks/chart/status');
  return response.data; // { active: 200, sold: 50, completed: 10, dead: 5 }
};


export const createVaccination = async (vaccinationData) => {
  const response = await API.post('/vaccinations', vaccinationData);
  return response.data;
};

export const fetchVaccinations = async () => {
  const response = await API.get('/vaccinations');
  return response.data;
};

export const fetchVaccinationStats = async () => {
  const response = await API.get('/vaccinations/stats');
  return response.data;
};

export const fetchVaccinationChartData = async () => {
  const response = await API.get('/vaccinations/chart');
  return response.data;
};

export const fetchNextVaccination = async () => {
  const response = await API.get('/vaccinations/next');
  return response.data;
};

// Fetch flock details by ID
export const fetchFlockById = async (id) => {
  const response = await API.get(`/flocks/${id}`);
  return response.data;
};

// Log new health record
export const logFlockHealth = async (id, data) => {
  const response = await API.post(`/flocks/${id}/health-log`, data);
  return response.data;
};

// Log new feed record
export const logFlockFeed = async (id, data) => {
  const response = await API.post(`/flocks/${id}/feed-log`, data);
  return response.data;
};


export default API;
