import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

/**
 * Standard API response wrapper used by all backend endpoints.
 * Every response from the SlideMentor backend is shaped as:
 *   { success: boolean; message: string; data: T }
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

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
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      if (error.response?.status === 403) {
        console.warn('[API] Forbidden — insufficient permissions');
      }
    }
    return Promise.reject(error);
  },
);

/* ─── Response Helpers ─── */

/**
 * Extract the `data` payload from a successful API response.
 * Throws if the backend returned `success: false`.
 */
export function unwrapResponse<T>(response: ApiResponse<T>): T {
  if (!response.success) {
    throw new Error(response.message || 'Request failed');
  }
  return response.data;
}

/**
 * Extract a user-friendly error message from any API error.
 * Handles Axios errors (including backend error bodies), plain Errors,
 * and unknown throw values.
 */
export function extractApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data && typeof data === 'object' && 'message' in data) {
      return (data as { message: string }).message;
    }
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
}

export default apiClient;
