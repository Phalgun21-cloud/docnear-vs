import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  role?: 'patient' | 'doctor';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'patient' | 'doctor') => Promise<void>;
  verifyOtp: (email: string, otp: string, role?: 'patient' | 'doctor') => Promise<{ role: string; user: User }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage on mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token: newToken, user: userData, role: userRole } = response.data;
      
      // Store user with role
      const userWithRole = { ...userData, role: userRole };
      
      setToken(newToken);
      setUser(userWithRole);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userWithRole));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

      const signup = async (name: string, email: string, password: string, role: 'patient' | 'doctor') => {
        try {
          const response = await authAPI.signup({ name, email, password, role });
          // Return response data which may include OTP in development mode
          return response.data;
    } catch (error: any) {
      // Preserve the full error object with response data
      if (error.response) {
        // Server responded with error
        const errorMessage = error.response.data?.message || 'Signup failed';
        const apiError = new Error(errorMessage);
        (apiError as any).response = error.response;
        throw apiError;
      } else if (error.request) {
        // Request made but no response (network error)
        throw new Error('Network error. Please check if the backend server is running.');
      } else {
        // Something else happened
        throw new Error(error.message || 'Signup failed');
      }
    }
  };

  const verifyOtp = async (email: string, otp: string, role?: 'patient' | 'doctor') => {
    try {
      const response = await authAPI.verifyOtp({ email, otp, role });
      const { user: userData, role: userRole } = response.data;
      
      // Store user with role
      const userWithRole = { ...userData, role: userRole };
      setUser(userWithRole);
      localStorage.setItem('user', JSON.stringify(userWithRole));
      
      return { role: userRole, user: userWithRole };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'OTP verification failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        signup,
        verifyOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};