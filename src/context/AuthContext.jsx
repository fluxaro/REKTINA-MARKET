/**
 * AuthContext — JWT auth state. Tries real backend, falls back gracefully.
 */

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/endpoints';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore session on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('authUser');

      if (storedToken && storedUser) {
        setToken(storedToken);
        const parsed = JSON.parse(storedUser);
        setUser(parsed);

        // Verify token is still valid
        try {
          const current = await authApi.getCurrentUser();
          setUser(current);
          localStorage.setItem('authUser', JSON.stringify(current));
        } catch {
          // Token expired — clear
          localStorage.removeItem('token');
          localStorage.removeItem('authUser');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.login({ email, password });
      const { token: newToken, user: userData } = response;
      localStorage.setItem('token', newToken);
      localStorage.setItem('authUser', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.register({ name, email, password });
      return response;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyOtp = useCallback(async (email, otp) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.verifyOtp({ email, otp });
      const { token: newToken, user: userData } = response;
      localStorage.setItem('token', newToken);
      localStorage.setItem('authUser', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message || 'OTP verification failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    localStorage.removeItem('token');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!token && !!user;
  const userRole = user?.role;

  return (
    <AuthContext.Provider value={{
      user, token, loading, error,
      isAuthenticated, userRole,
      login, register, verifyOtp, logout,
      setError,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
