import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => { return Promise.reject(error); }
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (( status === 401 || status === 419 )) {
      localStorage.removeItem('token');
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
