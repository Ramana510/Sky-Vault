import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://sky-vault-lau4.onrender.com/api' : 'http://localhost:5000/api');
if (!import.meta.env.VITE_API_URL) {
  console.warn(`VITE_API_URL is not defined. Falling back to ${baseURL}`);
}

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem('sky-vault-user');
  if (storedUser) {
    const { token } = JSON.parse(storedUser);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
