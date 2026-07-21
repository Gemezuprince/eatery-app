import axios from 'axios';

const api = axios.create({
  baseURL: 'https://congenial-goggles-jjx9jgvw7g742v9p-5000.app.github.dev/',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
