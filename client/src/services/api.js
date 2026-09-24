import axios from 'axios';

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    // If running on localhost or local Wi-Fi IP address (e.g. 192.168.x.x, 10.x.x.x)
    if (host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.') || host.startsWith('10.') || host.startsWith('172.')) {
      const port = import.meta.env.VITE_BACKEND_PORT || 5000;
      return `http://${host}:${port}/api`;
    }
  }
  // Production fallback on Vercel deployment (uses relative /api - no port needed!)
  return '/api';
};

const API_BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token if stored & Log Request details for dev
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ammu_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`[API Request]: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.data || '');
  return config;
}, (error) => Promise.reject(error));

// Response interceptor for detailed developer logging
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response Success]: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status, response.data);
    return response;
  },
  (error) => {
    console.error(`[API Response Error]: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      baseURL: error.config?.baseURL
    });
    return Promise.reject(error);
  }
);

// API Helper Endpoints
export const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getMyOrders = async (params) => {
  const response = await api.get('/orders/my-orders', { params });
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const uploadCustomerPhoto = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const loginApi = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerApi = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// Admin Endpoints
export const getAdminOrders = async (status = '') => {
  const response = await api.get('/orders/admin/all', { params: { status } });
  return response.data;
};

export const updateOrderStatus = async (orderId, orderStatus) => {
  const response = await api.patch(`/orders/admin/${orderId}/status`, { orderStatus });
  return response.data;
};

export const verifyPaymentApi = async (orderId, action) => {
  const response = await api.patch(`/orders/admin/${orderId}/payment-verify`, { action });
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export default api;
