import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../utils/api';
import { getAuthToken, setAuthToken as storageSetToken, clearAuthToken } from '../utils/storage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (initialPayload) => {
    try {
      const { data } = await API.get('/users/profile');
      setUser({ ...initialPayload, ...data });
    } catch (err) {
      console.error("Error fetching profile, using payload fallback:", err);
      setUser(initialPayload);
    } finally {
      setLoading(false);
    }
  };

  const login = (token) => {
    storageSetToken(token);
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload);
      fetchProfile(payload);
    } catch (e) {
      console.error('Invalid token on login');
    }
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
        await fetchProfile(payload);
      } catch (e) {
        logout();
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
