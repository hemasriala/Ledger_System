// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => {
    return localStorage.getItem('token');
};

// Set token in localStorage
const setToken = (token) => {
    localStorage.setItem('token', token);
};

// Remove token from localStorage
const removeToken = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// API Request helper
const apiRequest = async (endpoint, options = {}) => {
    const token = getToken();
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...config,
        ...options,
        headers: {
            ...config.headers,
            ...options.headers,
        },
    });

    // Handle non-JSON responses
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        data = await response.json();
    } else {
        const text = await response.text();
        throw new Error(text || 'Something went wrong');
    }

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
};

// Auth API
const authAPI = {
    register: async (userData) => {
        return await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },

    login: async (phone, pin, role) => {
        return await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ phone, pin, role }),
        });
    },

    getMe: async () => {
        return await apiRequest('/auth/me');
    },
};

// Transaction API
const transactionAPI = {
    getAll: async () => {
        return await apiRequest('/transactions');
    },

    getById: async (id) => {
        return await apiRequest(`/transactions/${id}`);
    },

    create: async (transactionData) => {
        return await apiRequest('/transactions', {
            method: 'POST',
            body: JSON.stringify(transactionData),
        });
    },

    update: async (id, transactionData) => {
        return await apiRequest(`/transactions/${id}`, {
            method: 'PUT',
            body: JSON.stringify(transactionData),
        });
    },

    delete: async (id) => {
        return await apiRequest(`/transactions/${id}`, {
            method: 'DELETE',
        });
    },
};

