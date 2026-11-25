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
  getProductBySku: (sku) => api.get(`/products/by-sku/${encodeURIComponent(sku)}`),
  createProduct: (payload) => api.post('/products', payload),
  getLowStock: () => api.get('/products/low-stock'),
  getOrders: () => api.get('/orders'),
  createOrder: (payload) => api.post('/orders', payload),
  createStockEntry: (payload) => api.post('/stock-entries', payload),
  getSuppliers: () => api.get('/suppliers'),
  createSupplier: (payload) => api.post('/suppliers', payload),
};

export default api;