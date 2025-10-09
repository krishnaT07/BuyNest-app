// API configuration and utility functions
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://buynestweb.netlify.app/api";

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem("buynest_token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiError({
          message: data.message || "An error occurred",
          status: response.status,
          errors: data.errors,
        });
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError({
        message: "Network error occurred",
        status: 0,
      });
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

// Create API client instance
export const api = new ApiClient(API_BASE_URL);

// API endpoints
export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    profile: "/auth/profile",
  },
  shops: {
    list: "/shops",
    create: "/shops",
    byId: (id: string) => `/shops/${id}`,
    search: "/shops/search",
    nearby: "/shops/nearby",
  },
  products: {
    list: "/products",
    create: "/products",
    byId: (id: string) => `/products/${id}`,
    byShop: (shopId: string) => `/shops/${shopId}/products`,
    search: "/products/search",
    categories: "/products/categories",
  },
  orders: {
    list: "/orders",
    create: "/orders",
    byId: (id: string) => `/orders/${id}`,
    userOrders: "/orders/user",
    shopOrders: (shopId: string) => `/shops/${shopId}/orders`,
  },
  users: {
    profile: "/users/profile",
    update: "/users/profile",
    addresses: "/users/addresses",
    paymentMethods: "/users/payment-methods",
  },
  admin: {
    stats: "/admin/stats",
    users: "/admin/users",
    shops: "/admin/shops",
    orders: "/admin/orders",
  },
};

// Error class for API errors
class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor({ message, status, errors }: { message: string; status: number; errors?: Record<string, string[]> }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export { ApiError };