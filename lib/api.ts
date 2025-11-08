// API Configuration
export const API_BASE_URL = 'http://103.124.92.135:3006/api';

// API Endpoints
export const API_ENDPOINTS = {
  categories: `${API_BASE_URL}/categories`,
  products: `${API_BASE_URL}/products`,
  users: `${API_BASE_URL}/users`,
  payments: `${API_BASE_URL}/payments`,
};

// API Utility Functions
export const apiRequest = async (endpoint: string, options?: RequestInit) => {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

// Category API functions
export const categoryApi = {
  getAll: () => apiRequest(API_ENDPOINTS.categories),
  getById: (id: string) => apiRequest(`${API_ENDPOINTS.categories}/${id}`),
  create: (data: any) => apiRequest(API_ENDPOINTS.categories, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`${API_ENDPOINTS.categories}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`${API_ENDPOINTS.categories}/${id}`, {
    method: 'DELETE',
  }),
};

// Product API functions
export const productApi = {
  getAll: () => apiRequest(API_ENDPOINTS.products),
  getById: (id: string) => apiRequest(`${API_ENDPOINTS.products}/${id}`),
  getByCategory: (categoryId: string) => apiRequest(`${API_ENDPOINTS.products}/category/${categoryId}`),
  create: (data: any) => apiRequest(API_ENDPOINTS.products, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`${API_ENDPOINTS.products}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`${API_ENDPOINTS.products}/${id}`, {
    method: 'DELETE',
  }),
};