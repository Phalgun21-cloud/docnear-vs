import axios from 'axios';
import { getToken } from '@clerk/clerk-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Clerk token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting Clerk token:', error);
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
      // Redirect to sign-in if unauthorized
      window.location.href = '/sign-in';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data: { name: string; email: string; password: string; role: 'patient' | 'doctor' | 'lab'; phone?: string; registrationNumber?: string; labCode?: string; specialization?: string; address?: string }) =>
    api.post('/auth/signup', data),
  verifyOtp: (data: { email: string; otp: string; role?: 'patient' | 'doctor' | 'lab' }) =>
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
  getAll: (userId: string, role: 'patient' | 'doctor' | 'lab') =>
    api.get('/appointments', { params: { userId, role } }),
  getById: (id: string) => api.get(`/appointments/${id}`),
};

// EMI API
export const emiAPI = {
  calculate: (data: { amount: number; tenure: number }) =>
    api.post('/emi/calculate', data),
  create: (data: { patientId: string; serviceId: string; amount: number; tenure: number }) =>
    api.post('/emi/create', data),
  getPatientEMIs: (patientId: string) =>
    api.get(`/emi/patient/${patientId}`),
  getById: (id: string) =>
    api.get(`/emi/${id}`),
};

// Services API
export const servicesAPI = {
  getAll: () => api.get('/services'),
  getById: (id: string) => api.get(`/services/${id}`),
  create: (data: any) => api.post('/services', data),
};

// Payments API
export const paymentsAPI = {
  processPayment: (data: { patientId: string; appointmentId?: string; amount: number; paymentMethod: string; useEMI?: boolean; tenure?: number }) =>
    api.post('/payments/process', data),
  processEMIPayment: (data: { emiId: string; amount: number }) =>
    api.post('/payments/emi', data),
  getHistory: (patientId: string) =>
    api.get(`/payments/history/${patientId}`),
  getById: (id: string) =>
    api.get(`/payments/${id}`),
};

// Lab API
export const labAPI = {
  createTest: (data: { patientId: string; labId: string; testType: string; testName: string; notes?: string; appointmentId?: string }) =>
    api.post('/lab/create', data),
  uploadResult: (formData: FormData) =>
    api.post('/lab/upload-result', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  getPatientTests: (patientId: string) =>
    api.get(`/lab/patient/${patientId}`),
  getLabTests: (labId: string) =>
    api.get(`/lab/lab/${labId}`),
  getTestById: (id: string) =>
    api.get(`/lab/${id}`),
  updateStatus: (id: string, status: string) =>
    api.patch(`/lab/${id}/status`, { status }),
};

export default api;