// Mock API with simulated async delays
// Swap these functions with real API calls when backend is ready

const delay = (ms = 600) => new Promise(res => setTimeout(res, ms));

import { PRODUCTS, ORDERS, REVIEWS, COUPONS, SELLERS } from '../data/mockData';

// Auth
export const apiLogin = async (email, password) => {
  await delay(800);
  if (!email || !password) throw new Error('Email and password required');
  // Mock role detection
  const role = email.includes('admin') ? 'admin' : email.includes('seller') ? 'seller' : 'buyer';
  return {
    id: 'u_' + Date.now(),
    name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    email,
    role,
    avatar: null,
    token: 'mock_jwt_' + Date.now(),
  };
};

export const apiSignup = async (name, email, password, role = 'buyer') => {
  await delay(1000);
  if (!name || !email || !password) throw new Error('All fields required');
  return { id: 'u_' + Date.now(), name, email, role, avatar: null, token: 'mock_jwt_' + Date.now() };
};

export const apiMagicLink = async (email) => {
  await delay(600);
  return { message: `Magic link sent to ${email}` };
};

// Products
export const apiGetProducts = async (filters = {}) => {
  await delay(500);
  let results = PRODUCTS.map(p => ({
    ...p,
    deliveryTime: p.id % 3 === 0 ? 'Same Day' : p.id % 3 === 1 ? '1-2 Days' : '3-5 Days'
  }));
  if (filters.category) results = results.filter(p => p.category === filters.category);
  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.sellerName.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some(t => t.includes(q))
    );
  }
  if (filters.minPrice) results = results.filter(p => p.price >= filters.minPrice);
  if (filters.maxPrice) results = results.filter(p => p.price <= filters.maxPrice);
  if (filters.minRating) results = results.filter(p => p.rating >= filters.minRating);
  if (filters.inStock) results = results.filter(p => p.stock > 0);
  if (filters.deliveryTime) results = results.filter(p => p.deliveryTime === filters.deliveryTime);
  if (filters.sort === 'price_asc') results.sort((a, b) => a.price - b.price);
  else if (filters.sort === 'price_desc') results.sort((a, b) => b.price - a.price);
  else if (filters.sort === 'rating') results.sort((a, b) => b.rating - a.rating);
  else results.sort((a, b) => b.id - a.id); // newest
  return results;
};

export const apiGetProduct = async (id) => {
  await delay(400);
  const product = PRODUCTS.find(p => p.id === Number(id));
  if (!product) throw new Error('Product not found');
  return {
    ...product,
    deliveryTime: product.id % 3 === 0 ? 'Same Day' : product.id % 3 === 1 ? '1-2 Days' : '3-5 Days'
  };
};

export const apiCreateProduct = async (data) => {
  await delay(800);
  return { ...data, id: Date.now(), rating: 0, reviewCount: 0 };
};

export const apiUpdateProduct = async (id, data) => {
  await delay(600);
  return { id, ...data };
};

export const apiDeleteProduct = async (id) => {
  await delay(500);
  return { success: true };
};

// Orders
export const apiGetOrders = async () => {
  await delay(600);
  return ORDERS;
};

export const apiGetOrder = async (id) => {
  await delay(400);
  return ORDERS.find(o => o.id === id) || null;
};

export const apiCreateOrder = async (orderData) => {
  await delay(1200);
  return { ...orderData, id: 'ORD-' + Math.floor(1000 + Math.random() * 9000), status: 'pending', date: new Date().toISOString().split('T')[0] };
};

export const apiUpdateOrderStatus = async (id, status) => {
  await delay(500);
  return { id, status };
};

// Reviews
export const apiGetReviews = async (productId) => {
  await delay(400);
  return REVIEWS.filter(r => r.productId === Number(productId));
};

export const apiAddReview = async (review) => {
  await delay(700);
  return { ...review, id: Date.now(), date: new Date().toISOString().split('T')[0] };
};

// Coupons
export const apiValidateCoupon = async (code, orderTotal) => {
  await delay(500);
  const coupon = COUPONS.find(c => c.code === code.toUpperCase());
  if (!coupon) throw new Error('Invalid coupon code');
  if (orderTotal < coupon.minOrder) throw new Error(`Minimum order ₦${coupon.minOrder} required`);
  return coupon;
};

// Sellers
export const apiGetSellers = async () => {
  await delay(400);
  return SELLERS;
};

// Admin
export const apiGetUsers = async () => {
  await delay(600);
  return [
    { id: 'u1', name: 'Chidi Okonkwo',    email: 'chidi.okonkwo@gmail.com',    role: 'buyer',  status: 'active',    joined: '2026-01-15', verified: false },
    { id: 'u2', name: 'Adaeze Nwosu',     email: 'adaeze.nwosu@yahoo.com',     role: 'seller', status: 'active',    joined: '2026-01-20', verified: true  },
    { id: 'u3', name: 'Babatunde Lawal',  email: 'baba.lawal@outlook.com',     role: 'seller', status: 'suspended', joined: '2026-02-01', verified: false },
    { id: 'u4', name: 'Ngozi Eze',        email: 'ngozi.eze@gmail.com',        role: 'buyer',  status: 'active',    joined: '2026-02-10', verified: false },
    { id: 'u5', name: 'Emeka Obiora',     email: 'emeka.obiora@gmail.com',     role: 'buyer',  status: 'active',    joined: '2026-03-01', verified: false },
    { id: 'u6', name: 'Funmilayo Bello',  email: 'funmi.bello@gmail.com',      role: 'seller', status: 'active',    joined: '2026-03-05', verified: true  },
    { id: 'u7', name: 'Oluwaseun Adesanya', email: 'seun.adesanya@yahoo.com',  role: 'buyer',  status: 'active',    joined: '2026-03-10', verified: false },
    { id: 'u8', name: 'Amaka Igwe',       email: 'amaka.igwe@gmail.com',       role: 'seller', status: 'active',    joined: '2026-03-12', verified: false },
  ];
};
