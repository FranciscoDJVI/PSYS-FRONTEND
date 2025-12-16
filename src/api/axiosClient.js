import axios from "axios";
import { apiLogger } from "./apiLogger";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
})

// JWT
const getRefreshToken = () => localStorage.getItem('refresh_token')
// Interceptor of request
axiosClient.interceptors.request.use(
  (config) => {
    // Agregar metadata para timing y logging
    config.metadata = {
      startTime: Date.now(),
      requestId: Math.random().toString(36).substr(2, 9)
    };

    // Logging de request
    apiLogger.request(config);

    const accessToken = localStorage.getItem('access_token')
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    // Logging error request
    apiLogger.error(error, {
      type: 'REQUEST_SETUP_ERROR',
      phase: 'request'
    });
    return Promise.reject(error);
  }
);

// Interceptor of response
axiosClient.interceptors.response.use(
  (response) => {
    // duration request
    const duration = Date.now() - response.config.metadata.startTime;

    // Logging successfull response
    apiLogger.response(response, duration);

    // Logging performance
    if (duration > 5000) {
      apiLogger.performance({
        type: 'SLOW_REQUEST',
        url: response.config.url,
        duration,
        size: apiLogger.calculateResponseSize(response.data)
      });
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    const duration = originalRequest?.metadata?.startTime
      ? Date.now() - originalRequest.metadata.startTime
      : null;

    apiLogger.error(error, {
      attemptNumber: originalRequest?._retry ? 2 : 1,
      hasRefreshToken: !!getRefreshToken(),
      duration,
      phase: 'response'
    });

    // Lógic refresh token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();

      if (refreshToken) {
        apiLogger.request({
          ...originalRequest,
          _retry: true,
          metadata: { ...originalRequest.metadata, retryAttempt: true }
        });

        try {
          const res = await axiosClient.post("auth/token/refresh/", {
            refresh: refreshToken,
          });

          localStorage.setItem('access_token', res.data.access);
          originalRequest.headers['Authorization'] = `Bearer ${res.data.access}`;

          // Log successfull retry
          apiLogger.request(originalRequest);

          return axiosClient(originalRequest);
        } catch (refreshError) {
          apiLogger.error(refreshError, {
            type: 'TOKEN_REFRESH_FAILED',
            originalError: error.message
          });

          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');

          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);
export default axiosClient;
