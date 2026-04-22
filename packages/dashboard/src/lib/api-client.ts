import axios from 'axios';
import { getAccessToken } from './cognito';

/**
 * Axios instance pre-configured for the MediaForge API.
 *
 * TODO:
 * - Base URL from env
 * - Request interceptor: attach Authorization: Bearer <jwt> header
 * - Response interceptor: on 401, attempt token refresh, retry once
 * - Error normalization: extract { code, message } from API error responses
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT
api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // TODO: If 401, refresh token and retry the request once
    return Promise.reject(error?.response?.data || error);
  },
);

export default api;
