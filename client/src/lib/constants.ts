/**
 * Application Constants
 * Centralized constants for the BuyNest application
 */

// Order Status Constants
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed', 
  PREPARING: 'preparing',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Order Pending',
  [ORDER_STATUS.CONFIRMED]: 'Order Confirmed',
  [ORDER_STATUS.PREPARING]: 'Being Prepared',
  [ORDER_STATUS.OUT_FOR_DELIVERY]: 'Out for Delivery',
  [ORDER_STATUS.DELIVERED]: 'Delivered',
  [ORDER_STATUS.CANCELLED]: 'Cancelled',
} as const;

// User Roles
export const USER_ROLES = {
  BUYER: 'buyer',
  SELLER: 'seller', 
  ADMIN: 'admin',
} as const;

// Shop Categories
export const SHOP_CATEGORIES = [
  'Grocery',
  'Restaurant',
  'Pharmacy',
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Sports',
  'Books',
  'Beauty',
  'Automotive',
  'Health',
  'Toys',
  'Pet Supplies',
  'Office Supplies',
  'Gifts',
] as const;

// Product Categories
export const PRODUCT_CATEGORIES = [
  'Fresh Produce',
  'Dairy & Eggs', 
  'Meat & Seafood',
  'Bakery',
  'Beverages',
  'Snacks',
  'Frozen Foods',
  'Pantry Staples',
  'Health & Wellness',
  'Personal Care',
  'Household Items',
  'Electronics',
  'Clothing',
  'Books',
  'Toys & Games',
  'Sports & Outdoors',
  'Arts & Crafts',
  'Automotive',
  'Pet Care',
  'Office Supplies',
] as const;

// Payment Methods
export const PAYMENT_METHODS = {
  CARD: 'card',
  CASH: 'cash',
  DIGITAL_WALLET: 'digital_wallet',
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning', 
  ERROR: 'error',
} as const;

// API Endpoints
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },
  SHOPS: {
    LIST: '/shops',
    DETAILS: '/shops/:id',
    CREATE: '/shops',
    UPDATE: '/shops/:id',
    DELETE: '/shops/:id',
  },
  PRODUCTS: {
    LIST: '/products',
    DETAILS: '/products/:id',
    CREATE: '/products',
    UPDATE: '/products/:id',
    DELETE: '/products/:id',
    SEARCH: '/products/search',
  },
  ORDERS: {
    LIST: '/orders',
    DETAILS: '/orders/:id',
    CREATE: '/orders',
    UPDATE: '/orders/:id',
    CANCEL: '/orders/:id/cancel',
  },
  PAYMENTS: {
    CREATE_CHECKOUT: '/payments/checkout',
    VERIFY: '/payments/verify',
    WEBHOOK: '/payments/webhook',
  },
} as const;

// Validation Constants
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
} as const;

// UI Constants
export const UI = {
  SIDEBAR_WIDTH: 240,
  SIDEBAR_COLLAPSED_WIDTH: 56,
  HEADER_HEIGHT: 64,
  MOBILE_BREAKPOINT: 768,
  TOAST_DURATION: 3000,
} as const;

// Timing Constants
export const TIMING = {
  DEBOUNCE_SEARCH: 300,
  AUTO_SAVE: 2000,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  RETRY_DELAY: 1000,
  MAX_RETRIES: 3,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  CART: 'buynest_cart',
  USER_PREFERENCES: 'buynest_preferences',
  SEARCH_HISTORY: 'buynest_search_history',
  LOCATION: 'buynest_location',
  THEME: 'buynest_theme',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  SERVER: 'Something went wrong. Please try again later.',
  PAYMENT: 'Payment processing failed. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Successfully logged in!',
  REGISTER: 'Account created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PRODUCT_ADDED: 'Product added to cart!',
  ORDER_PLACED: 'Order placed successfully!',
  PAYMENT_SUCCESS: 'Payment completed successfully!',
} as const;

// Default Values
export const DEFAULTS = {
  ITEMS_PER_PAGE: 20,
  SEARCH_RADIUS: 10, // km
  DELIVERY_TIME: '30-45 minutes',
  CURRENCY_SYMBOL: '$',
  COUNTRY_CODE: 'US',
} as const;