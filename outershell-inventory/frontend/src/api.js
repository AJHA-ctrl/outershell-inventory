import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Attach token to every request
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const productsAPI = {
  getAll: (params) => API.get('/products', { params }),
  getOne: (id) => API.get(`/products/${id}`),
  create: (data) => API.post('/products', data),
  update: (id, data) => API.put(`/products/${id}`, data),
  updateStock: (id, stock) => API.patch(`/products/${id}/stock`, { stock }),
  delete: (id) => API.delete(`/products/${id}`),
  getStats: (branch) => API.get('/products/stats/dashboard', { params: { branch } }),
};

export const ordersAPI = {
  getAll: (params) => API.get('/orders', { params }),
  create: (data) => API.post('/orders', data),
  updateStatus: (id, status) => API.patch(`/orders/${id}/status`, { status }),
  getRevenue: (branch) => API.get('/orders/stats/revenue', { params: { branch } }),
};

export const aiAPI = {
  describe: (data) => API.post('/ai/describe', data),
  marketing: (data) => API.post('/ai/marketing', data),
  insights: (data) => API.post('/ai/insights', data),
};

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  verify: () => API.get('/auth/verify'),
};

export default API;
