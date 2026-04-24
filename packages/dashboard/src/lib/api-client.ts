import axios from 'axios';
import { getSession } from './cognito';

const api = axios.create({
  baseURL: 'https://a7mlumfhej.execute-api.us-east-1.amazonaws.com/prod',
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
});

api.interceptors.request.use(async (config) => {
  try {
    const session = await getSession();
    if (session) {
      // Cognito authorizer expects the ID token
      const token = session.getIdToken().getJwtToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.warn('Failed to get token:', e);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response - CORS or network issue');
    }
    return Promise.reject(error);
  },
);

export default api;
