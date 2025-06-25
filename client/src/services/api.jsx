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

export const fetchUserProfile = async () => {
  const response = await API.get("/auth/profile");
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

export const deleteVaccination = async (id) => {
  const response = await API.delete(`/vaccinations/${id}`);
  return response.data;
};

export const updateVaccination = async (id, data) => {
  const response = await API.put(`/vaccinations/${id}`, data);
  return response.data;
};

export const exportVaccinationsToExcel = async () => {
  const response = await API.get('/vaccinations/export', {
    responseType: 'blob' // Important for file downloads
  });
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

export const deleteFlock = async (flockId) => {
  await API.delete(`/flocks/${flockId}`);
};

export const exportFlock = async (flockId) => {
  const response = await API.get(`/flocks/export/${flockId}`, {
    responseType: 'blob',
  });
  
  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `flock_${flockId}_${new Date().toISOString().split('T')[0]}.xlsx`);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
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

  return res.data.imageUrl; 
};


export const askAI = async ({ question, image, chatId }) => {
  const res = await API.post("/ai/ask", {
    question,
    image, 
    chatId
  });
  return res.data;
};

export const fetchMessages = async (chatId, page = 1, limit = 20) => {
  const response = await API.get(`/ai/messages?chatId=${chatId}&page=${page}&limit=${limit}`);
  return response.data;
};

export const fetchChatHistory = async () => {
  const response = await API.get('/ai/chats');
  return response.data;
};

export const createNewChat = async () => {
  const response = await API.post('/ai/chats');
  return response.data;
};

export const deleteChat = async (chatId) => {
  const response = await API.delete(`/ai/chats/${chatId}`);
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

export const fetchVisitors = async () => {
  try {
    const response = await API.get('/visitors/get');
    return response.data;
  } catch (error) {
    console.error('Error fetching visitors:', error);
    throw error;
  }
};

export const createVisitor = async (visitorData) => {
  try {
    const response = await API.post('/visitors/add', visitorData);
    return response.data;
  } catch (error) {
    console.error('Error creating visitor:', error);
    throw error;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await API.patch('/auth/profile', userData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        'Failed to update profile. Please try again.';
    console.error('Profile update error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// --- Community Forum ---
export const getForumPosts = async () => {
  const response = await API.get("/community/posts");
  return response.data;
};

export const getForumComments = async (postId) => {
  const response = await API.get(`/community/posts/${postId}/comments`);
  return response.data;
};

export const createForumPost = async (content) => {
  const response = await API.post("/community/posts", { content });
  return response.data;
};

export const updateForumPost = async (postId, content) => {
  const response = await API.put(`/community/posts/${postId}`, { content });
  return response.data;
};

export const deleteForumPost = async (postId) => {
  const response = await API.delete(`/community/posts/${postId}`);
  return response.data;
};

export const addCommentToPost = async (postId, text) => {
  const response = await API.post(`/community/posts/${postId}/comments`, { text });
  return response.data;
};

// --- Expert Consultation ---
export const getExpertsByRole = async (role) => {
  const response = await API.get(`/consultation/experts?role=${role}`);
  return response.data;
};

export const bookConsultation = async (bookingData) => {
  const response = await API.post("/consultation/bookings", bookingData);
  return response.data;
};

export const getUserConsultations = async () => {
  const response = await API.get("/consultation/bookings");
  return response.data;
};

export const getChatResponse = async (message) => {
  const response = await API.post("/consultation/chat", { message });
  return response.data;
};

export default API;
