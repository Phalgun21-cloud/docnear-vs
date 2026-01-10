import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data: { name: string; email: string; password: string; role: 'patient' | 'doctor' }) =>
    api.post('/auth/signup', data),
  verifyOtp: (data: { email: string; otp: string; role?: 'patient' | 'doctor' }) =>
    api.post('/auth/verify-otp', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

// Doctors API
export const doctorsAPI = {
  search: (params: { specialist?: string; userLat?: number; userLng?: number }) =>
    api.get('/doctors/search', { params }),
  getById: (id: string) => api.get(`/doctors/${id}`),
};

// Appointments API
export const appointmentsAPI = {
  book: (data: { patientId: string; doctorId: string; date: string; time: string }) =>
    api.post('/appointments/book', data),
  accept: (id: string) => api.post(`/appointments/accept/${id}`),
  getAll: (userId: string, role: 'patient' | 'doctor') =>
    api.get('/appointments', { params: { userId, role } }),
  getById: (id: string) => api.get(`/appointments/${id}`),
};

export default api;