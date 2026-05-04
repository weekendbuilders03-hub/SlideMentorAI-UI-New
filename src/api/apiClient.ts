import axios, { type AxiosRequestConfig } from 'axios';

const DEFAULT_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 🔹 Axios instance
const api = axios.create({
  baseURL: DEFAULT_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");

  if (token && config.headers) {
    (config.headers as any).Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.error("Unauthorized - Token expired");
      // optional: logout / redirect
    }
    return Promise.reject(err);
  }
);

// 🔹 Common Options Type
type ApiOptions = {
  baseURL?: string;
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
};

// 🔹 Config builder (centralized)
const buildConfig = (options?: ApiOptions): AxiosRequestConfig => ({
  baseURL: options?.baseURL || DEFAULT_BASE_URL,
  headers: options?.headers,
  params: options?.params,
});

// 🔹 GET
export const getApi = <T = any>(
  endpoint: string,
  options?: ApiOptions
) => api.get<T>(endpoint, buildConfig(options));

// 🔹 POST
export const postApi = <T = any>(
  endpoint: string,
  data?: any,
  options?: ApiOptions
) => api.post<T>(endpoint, data, buildConfig(options));

// 🔹 PUT
export const putApi = <T = any>(
  endpoint: string,
  data?: any,
  options?: ApiOptions
) => api.put<T>(endpoint, data, buildConfig(options));

// 🔹 DELETE
export const deleteApi = <T = any>(
  endpoint: string,
  options?: ApiOptions
) => api.delete<T>(endpoint, buildConfig(options));

export default api;