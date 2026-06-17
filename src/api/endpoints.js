import { fetchClient } from '../config/api';

export const authApi = {
  register: (data) => fetchClient('/register', { method: 'POST', body: JSON.stringify(data) }),
  verifyOtp: (data) => fetchClient('/verify-otp', { method: 'POST', body: JSON.stringify(data) }),
  resendOtp: (data) => fetchClient('/resend-otp', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => fetchClient('/login', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => fetchClient('/logout', { method: 'GET' }),
  getCurrentUser: () => fetchClient('/api/me', { method: 'GET' }),
  forgotPassword: (data) => fetchClient('/password/forgot', { method: 'POST', body: JSON.stringify(data) }),
  resetPassword: (token, data) => fetchClient(`/reset/${token}`, { method: 'POST', body: JSON.stringify(data) }),
};

export const listingsApi = {
  getListings: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchClient(`/listings${query ? `?${query}` : ''}`);
  },
  getListing: (id) => fetchClient(`/listings/${id}`),
  createListing: (data) => fetchClient('/listings', { method: 'POST', body: JSON.stringify(data) }),
  updateListing: (id, data) => fetchClient(`/listings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteListing: (id) => fetchClient(`/listings/${id}`, { method: 'DELETE' }),
};

export const cartApi = {
  getCart: () => fetchClient('/cart'),
  addToCart: (data) => fetchClient('/cart/add', { method: 'POST', body: JSON.stringify(data) }),
  removeFromCart: (id) => fetchClient(`/cart/remove/${id}`, { method: 'DELETE' }),
  checkout: (data) => fetchClient('/order/checkout', { method: 'POST', body: JSON.stringify(data) }),
};

export const ordersApi = {
  getOrders: () => fetchClient('/orders/me'),
  getOrder: (id) => fetchClient(`/order/${id}`),
  addReview: (id, data) => fetchClient(`/order/${id}/review`, { method: 'POST', body: JSON.stringify(data) }),
};

export const disputesApi = {
  getDisputes: () => fetchClient('/api/disputes'),
  createDispute: (data) => fetchClient('/api/disputes', { method: 'POST', body: JSON.stringify(data) }),
  getDispute: (id) => fetchClient(`/api/disputes/${id}`),
};

export const sellerApi = {
  getDashboard: () => fetchClient('/seller/dashboard'),
  getAnalytics: (month) => fetchClient(`/seller/analytics?month=${month}`),
};

export const adminApi = {
  getUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchClient(`/admin/users${query ? `?${query}` : ''}`);
  },
  updateUser: (id, data) => fetchClient(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getFlaggedListings: () => fetchClient('/admin/listings/flagged'),
  moderateListing: (id, action) => fetchClient(`/admin/listings/${id}/moderate`, { method: 'POST', body: JSON.stringify({ action }) }),
  broadcastMessage: (data) => fetchClient('/admin/broadcast', { method: 'POST', body: JSON.stringify(data) }),
};

export const referralsApi = {
  getReferrals: () => fetchClient('/api/referrals'),
  claimReward: () => fetchClient('/api/referrals/claim', { method: 'POST' }),
};

export const notificationsApi = {
  subscribe: (sub) => fetchClient('/notifications/subscribe', { method: 'POST', body: JSON.stringify(sub) }),
  unsubscribe: () => fetchClient('/notifications/unsubscribe', { method: 'DELETE' }),
};
