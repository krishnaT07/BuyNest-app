export type UserRole = "buyer" | "seller" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  address?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Shop {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  rating: number;
  reviewCount: number;
  openingHours: string;
  categories: string[];
  isOpen: boolean;
  deliveryTime: string;
  minimumOrder: number;
  ownerId: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  imageUrl: string;
  inStock: boolean;
  shopId: string;
  sku?: string;
  weight?: string;
  nutritionInfo?: {
    calories: number;
    protein: string;
    carbs: string;
    fiber: string;
    sugar: string;
  };
  isFeatured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  shopId: string;
  shopName: string;
  imageUrl: string;
}

export interface Order {
  id: string;
  userId: string;
  shopId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  deliveryAddress: string;
  phoneNumber: string;
  notes?: string;
  estimatedDeliveryTime: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export type OrderStatus = 
  | "pending" 
  | "confirmed" 
  | "preparing" 
  | "out_for_delivery" 
  | "delivered" 
  | "cancelled";

export interface Review {
  id: string;
  userId: string;
  shopId?: string;
  productId?: string;
  rating: number;
  comment: string;
  userName: string;
  userAvatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: Date;
}

export interface SearchFilters {
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  deliveryTime?: string;
  inStock?: boolean;
}