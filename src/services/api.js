import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
  resendOTP: (data) => api.post('/auth/resend-otp', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Notes
export const notesAPI = {
  getAll: (params) => api.get('/notes', { params }),
  getById: (id) => api.get(`/notes/${id}`),
  getFeatured: () => api.get('/notes/featured'),
  getPopular: () => api.get('/notes/popular'),
  getTrending: () => api.get('/notes/trending'),
  getLatest: () => api.get('/notes/latest'),
  download: (id) => api.get(`/notes/${id}/download`),
  create: (data) => api.post('/notes', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/notes/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/notes/${id}`),
};

// Subjects & Chapters
export const subjectsAPI = {
  getAll: () => api.get('/subjects'),
  getById: (id) => api.get(`/subjects/${id}`),
  create: (data) => api.post('/subjects', data),
  update: (id, data) => api.put(`/subjects/${id}`, data),
  delete: (id) => api.delete(`/subjects/${id}`),
};

export const chaptersAPI = {
  getBySubject: (subjectId) => api.get(`/chapters/subject/${subjectId}`),
  getById: (id, params) => api.get(`/chapters/${id}`, { params }),
  create: (data) => api.post('/chapters', data),
  update: (id, data) => api.put(`/chapters/${id}`, data),
  delete: (id) => api.delete(`/chapters/${id}`),
};

// Search
export const searchAPI = {
  search: (params) => api.get('/search', { params }),
  suggestions: (q) => api.get('/search/suggestions', { params: { q } }),
};

// Comments
export const commentsAPI = {
  getByNote: (noteId) => api.get(`/comments/note/${noteId}`),
  create: (noteId, data) => api.post(`/comments/note/${noteId}`, data),
  like: (id) => api.put(`/comments/${id}/like`),
  pin: (id, isPinned) => api.put(`/comments/${id}/pin`, { isPinned }),
  delete: (id) => api.delete(`/comments/${id}`),
  getAll: (params) => api.get('/comments/all', { params }),
};

// Bookmarks
export const bookmarksAPI = {
  getAll: (params) => api.get('/bookmarks', { params }),
  toggle: (noteId) => api.post(`/bookmarks/${noteId}`),
  getRecent: () => api.get('/bookmarks/recent'),
};

// Admin
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  banUser: (id, isBanned) => api.put(`/admin/users/${id}/ban`, { isBanned }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getUserActivity: (id) => api.get(`/admin/users/${id}/activity`),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.put('/admin/settings', data),
  uploadBanner: (data) => api.post('/admin/banners', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  sendAnnouncement: (data) => api.post('/admin/announcements', data),
};

// Notifications & Public
export const notificationsAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markRead: (id) => api.put(`/notifications/${id}/read`),
};

export const publicAPI = {
  getSettings: () => api.get('/public/settings'),
};

export const studentAPI = {
  contact: (data) => api.post('/student/contact', data),
};
