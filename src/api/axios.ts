import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

/** Centralized Axios instance used by all service files. */
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL ?? '',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15_000,
});

/* ─── Request Interceptor ─── */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = sessionStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

/* ─── Response Interceptor ─── */
apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        // Token expired — clear storage and redirect to login
        sessionStorage.removeItem('token');
        window.location.href = '/login';
      }
      if (error.response?.status === 403) {
        console.warn('[API] Forbidden — insufficient permissions');
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
