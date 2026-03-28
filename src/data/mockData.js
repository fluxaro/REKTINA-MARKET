// Mock data for REKTINA MARKET — Nigerian marketplace

export const CATEGORIES = [
  { id: 1, name: 'Electronics',   iconName: 'FiCpu',      count: 142, color: 'bg-blue-50 text-blue-600',    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80' },
  { id: 2, name: 'Fashion',       iconName: 'FiTag',      count: 89,  color: 'bg-pink-50 text-pink-600',    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80' },
  { id: 3, name: 'Home & Garden', iconName: 'FiHome',     count: 67,  color: 'bg-green-50 text-green-600',  image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80' },
  { id: 4, name: 'Sports',        iconName: 'FiActivity', count: 54,  color: 'bg-orange-50 text-orange-600',image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80' },
  { id: 5, name: 'Books',         iconName: 'FiBookOpen', count: 203, color: 'bg-yellow-50 text-yellow-600',image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80' },
  { id: 6, name: 'Beauty',        iconName: 'FiFeather',  count: 78,  color: 'bg-purple-50 text-purple-600',image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80' },
  { id: 7, name: 'Toys',          iconName: 'FiGift',     count: 45,  color: 'bg-red-50 text-red-500',      image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600&q=80' },
  { id: 8, name: 'Automotive',    iconName: 'FiTool',     count: 31,  color: 'bg-slate-50 text-slate-600',  image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80' },
];

export const SELLERS = [
  { id: 1, name: 'Chukwuemeka Gadgets',  avatar: null, rating: 4.8, sales: 1240, verified: true,  bio: 'Premium electronics and gadgets from Lagos', joined: '2024-01' },
  { id: 2, name: 'Adaeze Fashion House', avatar: null, rating: 4.6, sales: 890,  verified: true,  bio: 'Trendy Ankara and modern fashion for all',   joined: '2024-03' },
  { id: 3, name: 'Babatunde Home Store', avatar: null, rating: 4.5, sales: 567,  verified: false, bio: 'Quality home and garden products, Abuja',     joined: '2024-06' },
  { id: 4, name: 'Ngozi Sports World',   avatar: null, rating: 4.7, sales: 432,  verified: true,  bio: 'Everything for the active Nigerian lifestyle', joined: '2024-02' },
  { id: 5, name: 'Emeka Book Hub',       avatar: null, rating: 4.9, sales: 2100, verified: true,  bio: 'Books, textbooks and stationery nationwide',  joined: '2023-11' },
];

export const PRODUCTS = [
  {
    id: 1, name: 'Wireless Noise-Cancelling Headphones', price: 45000, originalPrice: 65000,
    category: 'Electronics', sellerId: 1, sellerName: 'Chukwuemeka Gadgets',
    rating: 4.7, reviewCount: 234, stock: 45, featured: true,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80',
    ],
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and foldable design. Perfect for Lagos commutes and everyday listening.',
    variants: { colors: ['Black', 'White', 'Blue'], sizes: [] },
    tags: ['wireless', 'audio', 'premium'],
  },
  {
    id: 2, name: 'Ankara Print Slim Fit Shirt', price: 8500, originalPrice: 12000,
    category: 'Fashion', sellerId: 2, sellerName: 'Adaeze Fashion House',
    rating: 4.3, reviewCount: 89, stock: 120, featured: true,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'],
    description: 'Beautiful Ankara print slim-fit shirt made from 100% quality cotton. Perfect for owambe parties and casual outings.',
    variants: { colors: ['Blue/Gold', 'Red/Black', 'Green/White'], sizes: ['XS', 'S', 'M', 'L', 'XL'] },
    tags: ['ankara', 'fashion', 'slim-fit'],
  },
  {
    id: 3, name: 'Smart Home Security Camera', price: 28000, originalPrice: 38000,
    category: 'Electronics', sellerId: 1, sellerName: 'Chukwuemeka Gadgets',
    rating: 4.5, reviewCount: 156, stock: 28, featured: true,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'],
    description: '1080p HD security camera with night vision, motion detection, and two-way audio. Ideal for securing your home in Nigeria.',
    variants: { colors: ['White', 'Black'], sizes: [] },
    tags: ['security', 'smart-home', 'camera'],
  },
  {
    id: 4, name: 'Ergonomic Office Chair', price: 95000, originalPrice: 135000,
    category: 'Home & Garden', sellerId: 3, sellerName: 'Babatunde Home Store',
    rating: 4.6, reviewCount: 78, stock: 12, featured: true,
    images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&q=80'],
    description: 'Fully adjustable ergonomic chair with lumbar support, breathable mesh back, and 5-year warranty. Great for long work-from-home sessions.',
    variants: { colors: ['Black', 'Gray'], sizes: [] },
    tags: ['office', 'ergonomic', 'chair'],
  },
  {
    id: 5, name: 'Running Shoes Pro', price: 32000, originalPrice: 45000,
    category: 'Sports', sellerId: 4, sellerName: 'Ngozi Sports World',
    rating: 4.8, reviewCount: 312, stock: 67, featured: false,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'],
    description: 'Lightweight running shoes with responsive cushioning and breathable upper. Perfect for morning runs on Lagos Island.',
    variants: { colors: ['Red', 'Blue', 'Black'], sizes: ['40', '41', '42', '43', '44', '45'] },
    tags: ['running', 'sports', 'shoes'],
  },
  {
    id: 6, name: 'Things Fall Apart — Chinua Achebe', price: 3500, originalPrice: 5000,
    category: 'Books', sellerId: 5, sellerName: 'Emeka Book Hub',
    rating: 4.9, reviewCount: 567, stock: 200, featured: false,
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80'],
    description: 'The classic Nigerian novel by Chinua Achebe. A must-read for every African household. Original paperback edition.',
    variants: { colors: [], sizes: [] },
    tags: ['novel', 'african-literature', 'achebe'],
  },
  {
    id: 7, name: 'Mechanical Gaming Keyboard', price: 55000, originalPrice: 72000,
    category: 'Electronics', sellerId: 1, sellerName: 'Chukwuemeka Gadgets',
    rating: 4.6, reviewCount: 189, stock: 34, featured: false,
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80'],
    description: 'RGB mechanical keyboard with Cherry MX switches, N-key rollover, and USB-C connection. For serious Nigerian gamers.',
    variants: { colors: ['Black', 'White'], sizes: [] },
    tags: ['gaming', 'keyboard', 'mechanical'],
  },
  {
    id: 8, name: 'Premium Yoga Mat', price: 15000, originalPrice: 22000,
    category: 'Sports', sellerId: 4, sellerName: 'Ngozi Sports World',
    rating: 4.4, reviewCount: 143, stock: 89, featured: false,
    images: ['https://images.unsplash.com/photo-1601925228008-f5e4c5e5e5e5?w=600&q=80'],
    description: 'Non-slip premium yoga mat with alignment lines, 6mm thickness, and carrying strap. Perfect for home workouts.',
    variants: { colors: ['Purple', 'Blue', 'Black'], sizes: [] },
    tags: ['yoga', 'fitness', 'mat'],
  },
  {
    id: 9, name: 'Shea Butter Skincare Kit', price: 18500, originalPrice: 26000,
    category: 'Beauty', sellerId: 2, sellerName: 'Adaeze Fashion House',
    rating: 4.5, reviewCount: 98, stock: 55, featured: false,
    images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80'],
    description: 'Complete Nigerian shea butter skincare kit with cleanser, toner, serum, and moisturizer. Made with natural African ingredients.',
    variants: { colors: [], sizes: ['Normal', 'Oily', 'Dry'] },
    tags: ['skincare', 'shea-butter', 'natural'],
  },
  {
    id: 10, name: 'Smart Watch Series X', price: 85000, originalPrice: 120000,
    category: 'Electronics', sellerId: 1, sellerName: 'Chukwuemeka Gadgets',
    rating: 4.7, reviewCount: 421, stock: 23, featured: true,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'],
    description: 'Advanced smartwatch with health monitoring, GPS, 5-day battery, and water resistance to 50m. Track your fitness across Nigeria.',
    variants: { colors: ['Black', 'Silver', 'Gold'], sizes: ['40mm', '44mm'] },
    tags: ['smartwatch', 'fitness', 'wearable'],
  },
  {
    id: 11, name: 'Portable Bluetooth Speaker', price: 19500, originalPrice: 28000,
    category: 'Electronics', sellerId: 1, sellerName: 'Chukwuemeka Gadgets',
    rating: 4.4, reviewCount: 267, stock: 78, featured: false,
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80'],
    description: '360° sound portable speaker, waterproof IPX7, 12-hour playtime. Great for owambe parties and outdoor events.',
    variants: { colors: ['Black', 'Blue', 'Red'], sizes: [] },
    tags: ['speaker', 'bluetooth', 'portable'],
  },
  {
    id: 12, name: 'Adire Linen Trousers', price: 12500, originalPrice: 18000,
    category: 'Fashion', sellerId: 2, sellerName: 'Adaeze Fashion House',
    rating: 4.2, reviewCount: 56, stock: 90, featured: false,
    images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80'],
    description: 'Breathable adire-dyed linen trousers, perfect for the Nigerian heat. Relaxed fit with side pockets.',
    variants: { colors: ['Indigo', 'Navy', 'Olive'], sizes: ['28', '30', '32', '34', '36'] },
    tags: ['adire', 'linen', 'fashion'],
  },
];

export const REVIEWS = [
  { id: 1, productId: 1, userId: 'u1', userName: 'Chidi Okonkwo', rating: 5, comment: 'Excellent headphones! The noise cancellation is perfect for blocking out Lagos traffic noise.', date: '2026-03-10', verified: true },
  { id: 2, productId: 1, userId: 'u2', userName: 'Amaka Eze', rating: 4, comment: 'Great sound quality, comfortable fit. Battery life is impressive. Delivered fast to Abuja!', date: '2026-03-05', verified: true },
  { id: 3, productId: 1, userId: 'u3', userName: 'Tunde Adeyemi', rating: 5, comment: "Best headphones I've owned. Worth every kobo!", date: '2026-02-28', verified: false },
  { id: 4, productId: 2, userId: 'u4', userName: 'Ngozi Obi', rating: 4, comment: 'Beautiful Ankara print, fits true to size. Got so many compliments at the owambe!', date: '2026-03-12', verified: true },
  { id: 5, productId: 10, userId: 'u1', userName: 'Chidi Okonkwo', rating: 5, comment: 'Amazing smartwatch, health tracking is very accurate. Great for my morning runs on the Island.', date: '2026-03-15', verified: true },
  { id: 6, productId: 4, userId: 'u5', userName: 'Emeka Nwosu', rating: 5, comment: 'Very comfortable chair. My back pain reduced significantly since I started using it for remote work.', date: '2026-03-18', verified: true },
];

export const ORDERS = [
  {
    id: 'RKT-1042', date: '2026-03-20', status: 'shipped', total: 73000,
    items: [
      { productId: 1, name: 'Wireless Headphones', qty: 1, price: 45000, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80' },
      { productId: 2, name: 'Ankara Print Shirt', qty: 2, price: 17000, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80' },
    ],
    address: { street: '14 Adeola Odeku Street', city: 'Lagos', state: 'Lagos', zip: '101233' },
    tracking: [
      { status: 'Order Placed', date: '2026-03-20', done: true },
      { status: 'Processing', date: '2026-03-21', done: true },
      { status: 'Shipped via GIG Logistics', date: '2026-03-22', done: true },
      { status: 'Out for Delivery', date: '2026-03-24', done: false },
      { status: 'Delivered', date: null, done: false },
    ],
  },
  {
    id: 'RKT-1038', date: '2026-03-15', status: 'delivered', total: 95000,
    items: [
      { productId: 4, name: 'Ergonomic Office Chair', qty: 1, price: 95000, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=100&q=80' },
    ],
    address: { street: '7 Wuse Zone 5', city: 'Abuja', state: 'FCT', zip: '900001' },
    tracking: [
      { status: 'Order Placed', date: '2026-03-15', done: true },
      { status: 'Processing', date: '2026-03-16', done: true },
      { status: 'Shipped via DHL Nigeria', date: '2026-03-17', done: true },
      { status: 'Out for Delivery', date: '2026-03-18', done: true },
      { status: 'Delivered', date: '2026-03-19', done: true },
    ],
  },
];

export const MESSAGES = [
  {
    id: 1, sellerId: 1, sellerName: 'Chukwuemeka Gadgets', unread: 2,
    messages: [
      { id: 1, from: 'seller', text: 'Nne, how can I help you today?', time: '10:30 AM' },
      { id: 2, from: 'buyer', text: 'Hi, I wanted to ask about the headphones warranty.', time: '10:32 AM' },
      { id: 3, from: 'seller', text: 'All our headphones come with a 1-year warranty. We also offer free repair in Lagos.', time: '10:33 AM' },
      { id: 4, from: 'seller', text: 'Anything else I can help you with?', time: '10:33 AM' },
    ],
  },
  {
    id: 2, sellerId: 2, sellerName: 'Adaeze Fashion House', unread: 0,
    messages: [
      { id: 1, from: 'buyer', text: 'Do you have the Ankara shirt in size XL?', time: 'Yesterday' },
      { id: 2, from: 'seller', text: 'Yes o! We have XL in stock. Shall I reserve one for you?', time: 'Yesterday' },
    ],
  },
];

export const COUPONS = [
  { code: 'SAVE10', discount: 10, type: 'percent', minOrder: 10000 },
  { code: 'FLAT5K', discount: 5000, type: 'fixed', minOrder: 30000 },
  { code: 'NEWUSER', discount: 15, type: 'percent', minOrder: 0 },
];

export const SELLER_ANALYTICS = {
  revenue: [
    { month: 'Oct', value: 420000 }, { month: 'Nov', value: 580000 }, { month: 'Dec', value: 890000 },
    { month: 'Jan', value: 620000 }, { month: 'Feb', value: 710000 }, { month: 'Mar', value: 940000 },
  ],
  orders: [
    { month: 'Oct', value: 42 }, { month: 'Nov', value: 58 }, { month: 'Dec', value: 89 },
    { month: 'Jan', value: 62 }, { month: 'Feb', value: 71 }, { month: 'Mar', value: 94 },
  ],
  topProducts: [
    { name: 'Wireless Headphones', sales: 124, revenue: 5580000 },
    { name: 'Smart Watch Series X', sales: 89, revenue: 7565000 },
    { name: 'Gaming Keyboard', sales: 67, revenue: 3685000 },
    { name: 'Security Camera', sales: 54, revenue: 1512000 },
    { name: 'Bluetooth Speaker', sales: 43, revenue: 838500 },
  ],
};

export const ADMIN_ANALYTICS = {
  totalUsers: 12847,
  totalSellers: 342,
  totalOrders: 8921,
  totalRevenue: 284750000,
  revenueByMonth: [
    { month: 'Oct', value: 38000000 }, { month: 'Nov', value: 52000000 }, { month: 'Dec', value: 89000000 },
    { month: 'Jan', value: 61000000 }, { month: 'Feb', value: 74000000 }, { month: 'Mar', value: 94000000 },
  ],
  categoryBreakdown: [
    { name: 'Electronics', value: 42 }, { name: 'Fashion', value: 28 },
    { name: 'Home', value: 15 }, { name: 'Sports', value: 10 }, { name: 'Other', value: 5 },
  ],
};
