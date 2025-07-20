// API Configuration
const API_BASE_URL = 'https://appliance-price-tracker-production.up.railway.app';

export const API_ENDPOINTS = {
  PRODUCTS: {
    SEARCH: '/api/products/search',
    DETAILS: '/api/products',
  },
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
  },
  HEALTH: '/health',
};

// Helper function to make API calls
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

export default API_BASE_URL; 