import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
})
//
// JWT
//
const getRefreshToken = () => localStorage.getItem('refresh_token')
// Intercetor de solicitud
axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token')
    if (accessToken) {
      //config.headers['Authorization'] = `Token ${accessToken}`;
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();

      if (refreshToken) {
        try {
          const res = await axiosClient.post("auth/token/refresh/", {
            refresh: refreshToken,
          });

          localStorage.setItem('access_token', res.data.access);
          originalRequest.headers['Authorization'] = `Bearer ${res.data.access}`;

          return axiosClient(originalRequest);
        } catch (refreshError) {
          console.error("Error al refrescar el token", refreshError);

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
