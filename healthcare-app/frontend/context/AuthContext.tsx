'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs';

interface User {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  role?: 'patient' | 'doctor' | 'lab';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'patient' | 'doctor' | 'lab') => Promise<void>;
  verifyOtp: (email: string, otp: string, role?: 'patient' | 'doctor' | 'lab') => Promise<{ role: string; user: User }>;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { signOut, getToken } = useClerkAuth();

  // Convert Clerk user to our User format
  const user: User | null = clerkUser
    ? {
        id: clerkUser.id,
        name: clerkUser.fullName || clerkUser.firstName || clerkUser.emailAddresses[0]?.emailAddress || 'User',
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        verified: clerkUser.emailAddresses[0]?.verification?.status === 'verified',
        role: (clerkUser.publicMetadata?.role as 'patient' | 'doctor' | 'lab') || 'patient',
      }
    : null;

  const isAuthenticated = !!clerkUser && clerkLoaded;

  // These functions are kept for backward compatibility but will redirect to Clerk
  const login = async () => {
    // Clerk handles login through their UI components
    throw new Error('Please use Clerk SignIn component for login');
  };

  const signup = async () => {
    // Clerk handles signup through their UI components
    throw new Error('Please use Clerk SignUp component for signup');
  };

  const verifyOtp = async () => {
    // Clerk handles email verification automatically
    throw new Error('Clerk handles email verification automatically');
  };

  const logout = async () => {
    await signOut();
  };

  const getAuthToken = async (): Promise<string | null> => {
    try {
      const token = await getToken();
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token: null, // Token is retrieved via getToken() when needed
        isAuthenticated,
        loading: !clerkLoaded,
        login,
        signup,
        verifyOtp,
        logout,
        getToken: getAuthToken,
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
