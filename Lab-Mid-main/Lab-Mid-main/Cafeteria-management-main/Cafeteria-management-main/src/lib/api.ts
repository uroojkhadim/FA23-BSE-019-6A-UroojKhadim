const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  const authUser = sessionStorage.getItem('authUser');
  if (!authUser) return null;
  
  try {
    const user = JSON.parse(authUser);
    return user.token || null;
  } catch {
    return null;
  }
};

// Generic API request handler
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Add authorization token if available
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Authentication APIs
export const authAPI = {
  login: async (email, password, role) => {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
  },

  registerStudent: async (data) => {
    return await apiRequest('/auth/register/student', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  registerTeacher: async (data) => {
    return await apiRequest('/auth/register/teacher', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  registerAdmin: async (data) => {
    return await apiRequest('/auth/register/admin', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getProfile: async () => {
    return await apiRequest('/auth/profile');
  },
};

// Generic CRUD APIs
export const crudAPI = {
  getAll: async (collection, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/${collection}?${queryString}` : `/${collection}`;
    return await apiRequest(endpoint);
  },

  getById: async (collection, id) => {
    return await apiRequest(`/${collection}/${id}`);
  },

  create: async (collection, data) => {
    return await apiRequest(`/${collection}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (collection, id, data) => {
    return await apiRequest(`/${collection}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (collection, id) => {
    return await apiRequest(`/${collection}/${id}`, {
      method: 'DELETE',
    });
  },
};

// Specific entity APIs for convenience
export const menuAPI = {
  getAll: (params = {}) => crudAPI.getAll('menuitems', params),
  getById: (id) => crudAPI.getById('menuitems', id),
  create: (data) => crudAPI.create('menuitems', data),
  update: (id, data) => crudAPI.update('menuitems', id, data),
  delete: (id) => crudAPI.delete('menuitems', id),
};

export const orderAPI = {
  getAll: (params = {}) => crudAPI.getAll('orders', params),
  getById: (id) => crudAPI.getById('orders', id),
  create: (data) => crudAPI.create('orders', data),
  update: (id, data) => crudAPI.update('orders', id, data),
  delete: (id) => crudAPI.delete('orders', id),
};

export const orderItemAPI = {
  getAll: (params = {}) => crudAPI.getAll('orderitems', params),
  getById: (id) => crudAPI.getById('orderitems', id),
  create: (data) => crudAPI.create('orderitems', data),
  update: (id, data) => crudAPI.update('orderitems', id, data),
  delete: (id) => crudAPI.delete('orderitems', id),
};

export const paymentAPI = {
  getAll: (params = {}) => crudAPI.getAll('payments', params),
  getById: (id) => crudAPI.getById('payments', id),
  create: (data) => crudAPI.create('payments', data),
  update: (id, data) => crudAPI.update('payments', id, data),
  delete: (id) => crudAPI.delete('payments', id),
};

export const discountAPI = {
  getAll: (params = {}) => crudAPI.getAll('discounts', params),
  getById: (id) => crudAPI.getById('discounts', id),
  create: (data) => crudAPI.create('discounts', data),
  update: (id, data) => crudAPI.update('discounts', id, data),
  delete: (id) => crudAPI.delete('discounts', id),
};

export const studentAPI = {
  getAll: (params = {}) => crudAPI.getAll('students', params),
  getById: (id) => crudAPI.getById('students', id),
  update: (id, data) => crudAPI.update('students', id, data),
  delete: (id) => crudAPI.delete('students', id),
};

export const teacherAPI = {
  getAll: (params = {}) => crudAPI.getAll('teachers', params),
  getById: (id) => crudAPI.getById('teachers', id),
  update: (id, data) => crudAPI.update('teachers', id, data),
  delete: (id) => crudAPI.delete('teachers', id),
};

export const adminAPI = {
  getAll: (params = {}) => crudAPI.getAll('admins', params),
  getById: (id) => crudAPI.getById('admins', id),
  update: (id, data) => crudAPI.update('admins', id, data),
  delete: (id) => crudAPI.delete('admins', id),
};
