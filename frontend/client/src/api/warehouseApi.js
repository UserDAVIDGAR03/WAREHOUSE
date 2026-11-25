import axios from 'axios';

const API_BASE = 'http://localhost:5289/api';

const api = axios.create({
  baseURL: API_BASE,
});

// Interceptor: adjunta el token automáticamente si existe en localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const warehouseService = {
  getProducts: () => api.get('/products'),
  createProduct: (payload) => api.post('/products', payload),
  getLowStock: () => api.get('/products/low-stock'),
  getOrders: () => api.get('/orders'),
  getSuppliers: () => api.get('/suppliers'),
  createSupplier: (payload) => api.post('/suppliers', payload),
};

export default api;