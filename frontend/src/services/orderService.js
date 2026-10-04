import axios from 'axios';

const USE_MOCK_DATA = false;

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56"><rect width="56" height="56" fill="#e5e7eb"/></svg>'
  );

const MOCK_ORDER_LIST = [
  { _id: 'a1b2c3d4e5f60001', status: 'delivered', totalAmount: 110000, createdAt: '2026-09-20T10:00:00Z' },
  { _id: 'a1b2c3d4e5f60002', status: 'shipped', totalAmount: 450000, createdAt: '2026-09-24T14:30:00Z' },
  { _id: 'a1b2c3d4e5f60003', status: 'processing', totalAmount: 70000, createdAt: '2026-09-26T09:15:00Z' },
  { _id: 'a1b2c3d4e5f60004', status: 'pending', totalAmount: 56000, createdAt: '2026-09-27T18:45:00Z' },
];

const MOCK_ORDER_DETAIL = {
  a1b2c3d4e5f60001: {
    _id: 'a1b2c3d4e5f60001',
    status: 'delivered',
    totalAmount: 110000,
    createdAt: '2026-09-20T10:00:00Z',
    items: [
      { _id: 'i1', productId: { _id: 'p1', name: 'Nike Air Force 1', images: [IMG] }, quantity: 1, priceAtPurchase: 65000 },
      { _id: 'i2', productId: { _id: 'p2', name: 'JBL Headphones', images: [IMG] }, quantity: 1, priceAtPurchase: 45000 },
    ],
  },
  a1b2c3d4e5f60002: {
    _id: 'a1b2c3d4e5f60002',
    status: 'shipped',
    totalAmount: 450000,
    createdAt: '2026-09-24T14:30:00Z',
    items: [
      { _id: 'i3', productId: { _id: 'p3', name: 'HP Pavilion Laptop', images: [IMG] }, quantity: 1, priceAtPurchase: 450000 },
    ],
  },
  a1b2c3d4e5f60003: {
    _id: 'a1b2c3d4e5f60003',
    status: 'processing',
    totalAmount: 70000,
    createdAt: '2026-09-26T09:15:00Z',
    items: [
      { _id: 'i4', productId: { _id: 'p4', name: 'Smart Watch', images: [IMG] }, quantity: 1, priceAtPurchase: 70000 },
    ],
  },
  a1b2c3d4e5f60004: {
    _id: 'a1b2c3d4e5f60004',
    status: 'pending',
    totalAmount: 56000,
    createdAt: '2026-09-27T18:45:00Z',
    items: [
      { _id: 'i5', productId: { _id: 'p5', name: 'Kitchen Blender', images: [IMG] }, quantity: 2, priceAtPurchase: 28000 },
    ],
  },
};

const fakeDelay = (data) => new Promise((resolve) => setTimeout(() => resolve(data), 300));


export const getOrders = () =>
  USE_MOCK_DATA
    ? fakeDelay(MOCK_ORDER_LIST)
    : api.get('/orders', { params: { limit: 50 } }).then((res) => res.data.data.items);


export const getOrderById = (id) => {
  if (USE_MOCK_DATA) {
    const found = MOCK_ORDER_DETAIL[id];
    return found ? fakeDelay(found) : Promise.reject(new Error('Order not found'));
  }
  return api.get(`/orders/${id}`).then((res) => res.data.data);
};


export const submitReview = (productId, { rating, comment }) =>
  USE_MOCK_DATA
    ? fakeDelay({ success: true })
    : api.post('/reviews', { product: productId, rating, comment }).then((res) => res.data);