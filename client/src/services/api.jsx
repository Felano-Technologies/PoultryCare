import axios from "axios";
import toast from "react-hot-toast";

const API = axios.create({
  // baseURL: "http://localhost:5000/api",
  // baseURL: "http://172.20.10.2:5000/api",
  baseURL: "https://poultrycare.onrender.com/api",
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

/// api.tsx
// --- Password Reset ---
export const sendOTP = async (email) => {
  const response = await API.post("/auth/forgot-password", { email });
  return response.data;
};

export const verifyOTP = async (email, otp) => {
  const response = await API.post("/auth/verify-reset-otp", { email, otp });
  return response.data;
};

export const resetPassword = async (email, newPassword) => {
  const response = await API.post("/auth/reset-password", { email, newPassword });
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
  return response.data; 
};

export const fetchFlockFeedCounts = async () => {
  const response = await API.get('/flocks/feed/status');
  return response.data; 
};

export const fetchFarmStats = async () => {
  const response = await API.get('/flocks/farm/stats');
  return response.data; 
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


// Upload image to backend (Cloudinary)
export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await API.post("/ai/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.imageUrl; // Returns the Cloudinary URL
};

// Ask the AI assistant (with optional image)
export const askAI = async ({ question, image }) => {
  const res = await API.post("/ai/ask", {
    question,
    image, 
  });
  return res.data;
};

export const fetchMessages = async (page = 1, limit = 20) => {
  const response = await API.get(`/ai/messages?page=${page}&limit=${limit}`);
  return response.data;
};



// Activity Log API
export const getRecentActivities = async () => {
  const response = await API.get('/activities');
  return response.data;
};

export const logActivity = async (activityData) => {
  const response = await API.post('/activities', activityData);
  return response.data;
};

// Notifications API
export const getNotifications = async () => {
  const response = await API.get('/notifications');
  return response.data;
};

export const markNotificationAsRead = async (id) => {
  const response = await API.patch(`/notifications/${id}/read`);
  return response.data;
};



export default API;
