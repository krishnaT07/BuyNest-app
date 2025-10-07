/**
 * Environment Configuration Module
 * Centralized configuration management for the BuyNest application
 */

export interface AppConfig {
  supabase: {
    url: string;
    anonKey: string;
    projectId: string;
  };
  app: {
    name: string;
    version: string;
    environment: 'development' | 'production' | 'staging';
    baseUrl: string;
  };
  features: {
    enablePayments: boolean;
    enableNotifications: boolean;
    enableAnalytics: boolean;
    enableGeolocation: boolean;
  };
  limits: {
    maxCartItems: number;
    maxFileSize: number; // in MB
    maxSearchResults: number;
  };
  defaults: {
    deliveryRadius: number; // in km
    orderTimeout: number; // in minutes
    currency: string;
  };
}

// Environment-specific configurations
const configs: Record<string, Partial<AppConfig>> = {
  development: {
    app: {
      environment: 'development',
      baseUrl: 'http://localhost:8080',
    },
    features: {
      enablePayments: true,
      enableNotifications: false,
      enableAnalytics: false,
      enableGeolocation: true,
    },
  },
  production: {
    app: {
      environment: 'production',
      baseUrl: 'https://your-domain.com',
    },
    features: {
      enablePayments: true,
      enableNotifications: true,
      enableAnalytics: true,
      enableGeolocation: true,
    },
  },
  staging: {
    app: {
      environment: 'staging',
      baseUrl: 'https://staging.your-domain.com',
    },
    features: {
      enablePayments: true,
      enableNotifications: false,
      enableAnalytics: false,
      enableGeolocation: true,
    },
  },
};

// Base configuration
const baseConfig: AppConfig = {
  supabase: {
    url: "https://mnntmkmxmlpycykdiuwd.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubnRta214bWxweWN5a2RpdXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0OTgwMjEsImV4cCI6MjA3MDA3NDAyMX0.Ogxn8Z5kmIkHY4_-8pfQx3SwzrRA6H_TCqQ3NNJ_4L8",
    projectId: "mnntmkmxmlpycykdiuwd",
  },
  app: {
    name: "BuyNest",
    version: "1.0.0",
    environment: 'development',
    baseUrl: 'http://localhost:8080',
  },
  features: {
    enablePayments: true,
    enableNotifications: true,
    enableAnalytics: false,
    enableGeolocation: true,
  },
  limits: {
    maxCartItems: 50,
    maxFileSize: 5, // 5MB
    maxSearchResults: 100,
  },
  defaults: {
    deliveryRadius: 10, // 10km
    orderTimeout: 30, // 30 minutes
    currency: 'USD',
  },
};

// Detect current environment
const getCurrentEnvironment = (): string => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return 'development';
  }
  
  if (hostname.includes('staging')) {
    return 'staging';
  }
  
  return 'production';
};

// Merge configurations
const createConfig = (): AppConfig => {
  const environment = getCurrentEnvironment();
  const envConfig = configs[environment] || {};
  
  return {
    ...baseConfig,
    ...envConfig,
    app: {
      ...baseConfig.app,
      ...envConfig.app,
      environment: environment as AppConfig['app']['environment'],
    },
    features: {
      ...baseConfig.features,
      ...envConfig.features,
    },
    limits: {
      ...baseConfig.limits,
      ...envConfig.limits,
    },
    defaults: {
      ...baseConfig.defaults,
      ...envConfig.defaults,
    },
  };
};

// Export the configuration
export const config = createConfig();

// Helper functions
export const isProduction = () => config.app.environment === 'production';
export const isDevelopment = () => config.app.environment === 'development';
export const isFeatureEnabled = (feature: keyof AppConfig['features']) => config.features[feature];

// Validation functions
export const validateConfig = (): boolean => {
  const required = [
    config.supabase.url,
    config.supabase.anonKey,
    config.app.name,
    config.app.baseUrl,
  ];
  
  return required.every(value => value && value.length > 0);
};

// Debug helper
export const getConfigInfo = () => {
  if (isDevelopment()) {
    return {
      environment: config.app.environment,
      features: config.features,
      supabaseUrl: config.supabase.url,
      isValid: validateConfig(),
    };
  }
  return null;
};