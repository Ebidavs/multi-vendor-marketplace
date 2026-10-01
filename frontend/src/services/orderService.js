import axios from 'axios';
const USE_MOCK_DATA = false;

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---------- Sample data (only used when USE_MOCK_DATA is true) ----------
const IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56"><rect width="56" height="56" fill="#e5e7eb"/></svg>'
  );

const MOCK_ORDERS = [
  {
    _id: 'a1b2c3d4e5f60001',
    status: 'delivered',
    createdAt: '2026-09-20T10:00:00Z',
    total: 110000,
    items: [
      { productId: 'p1', name: 'Nike Air Force 1', vendor: 'SneakerHub', price: 65000, quantity: 1, image: IMG },
      { productId: 'p2', name: 'JBL Headphones', vendor: 'SoundZ', price: 45000, quantity: 1, image: IMG },
    ],
  },
  {
    _id: 'a1b2c3d4e5f60002',
    status: 'shipped',
    createdAt: '2026-09-24T14:30:00Z',
    total: 450000,
    items: [
      { productId: 'p3', name: 'HP Pavilion Laptop', vendor: 'TechWorld', price: 450000, quantity: 1, image: IMG },
    ],
  },
  {
    _id: 'a1b2c3d4e5f60003',
    status: 'processing',
    createdAt: '2026-09-26T09:15:00Z',
    total: 70000,
    items: [
      { productId: 'p4', name: 'Smart Watch', vendor: 'TechStore', price: 70000, quantity: 1, image: IMG },
    ],
  },
  {
    _id: 'a1b2c3d4e5f60004',
    status: 'pending',
    createdAt: '2026-09-27T18:45:00Z',
    total: 56000,
    items: [
      { productId: 'p5', name: 'Kitchen Blender', vendor: 'HomeEssentials', price: 28000, quantity: 2, image: IMG },
    ],
  },
];

const fakeDelay = (data) => new Promise((resolve) => setTimeout(() => resolve(data), 300));

// ---------- Real API calls ----------
export const getOrders = () =>
  USE_MOCK_DATA
    ? fakeDelay(MOCK_ORDERS)
    : api.get('/orders/my-orders').then((res) => res.data);

export const getOrderById = (id) => {
  if (USE_MOCK_DATA) {
    const found = MOCK_ORDERS.find((order) => order._id === id);
    return found ? fakeDelay(found) : Promise.reject(new Error('Order not found'));
  }
  return api.get(`/orders/${id}`).then((res) => res.data);
};

export const submitReview = (productId, reviewData) =>
  USE_MOCK_DATA
    ? fakeDelay({ success: true })
    : api.post(`/products/${productId}/reviews`, reviewData).then((res) => res.data);