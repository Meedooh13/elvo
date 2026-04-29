import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
  withCredentials: true,
});

api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await axios.post(
          import.meta.env.VITE_API_URL + '/api/auth/refresh',
          {},
          { withCredentials: true },
        );
        original.headers['Authorization'] = `Bearer ${data.accessToken}`;
        useAuthStore.getState().setAccessToken(data.accessToken);
        return api(original);
      } catch {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(err);
  }
);

// Avoid circular import — import store lazily
import { useAuthStore } from '../store/auth.store';

export default api;
