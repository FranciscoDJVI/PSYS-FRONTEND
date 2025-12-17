import React, { useState, createContext, useContext, useCallback, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import logger from '../utils/logger';
import toast from 'react-hot-toast';

const API_LOGIN_URL = 'auth/token/';
const API_LOGOUT_URL = 'auth/logout/';
const API_REFRESH_URL = 'auth/token/refresh/'
const AuthContext = createContext({
  user: null,
  role: '',
  isAuthenticated: false,
  login: async () => { },
  logout: () => { },
});

const getAccessToken = () => localStorage.getItem('access_token');

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [role, setRole] = useState(localStorage.getItem('userRole') || '');
  const [accessToken, setAccessToken] = useState(getAccessToken());
  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');

    setUser(null);
    setRole('');
    setAccessToken(null);

  }, []);

  const login = useCallback(async (username, password) => {
    try {
      const response = await axiosClient.post(API_LOGIN_URL, { username, password });

      const { access, refresh, user_data, roles } = response.data;

      const role = roles && roles.length > 0 ? roles[0] : '';

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('userRole', role);
      localStorage.setItem('user', JSON.stringify(user_data || { username }));

      setUser(user_data || { username });
      setRole(role);
      setAccessToken(access);

      return response.data;

    } catch (error) {
      logger.error('Login fallido:', error.response?.data || error.message);
      toast.error('Error de inicio de sesión. Por favor, verifica tus credenciales.');
      logout();
      throw error;
    }
  }, [logout]);

  useEffect(() => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      const silentRefresh = async () => {
        try {
          const res = await axiosClient.post(API_REFRESH_URL, { refresh: refreshToken });
          localStorage.setItem('access_token', res.data.access);
          setAccessToken(res.data.access);
        } catch (error) {
          if (error.response?.status === 401) {
            logout();
          } else {
            logger.warn("Error de red en refresh silencioso, manteniendo sesión.");
          }
        }
      };
      silentRefresh();
    }
  }, [logout]);


  const contextValue = {
    user,
    role,
    isAuthenticated: !!accessToken,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};
