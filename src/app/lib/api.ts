// Base API setup
import axios from 'axios';

const API_URL = 'https://steady-valery-megan123-feff4840.koyeb.app/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Add response interceptor for handling unauthorized responses
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle 401 Unauthorized responses
        if (error.response && error.response.status === 401) {
            // Clear token from localStorage
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');

                // Redirect to login page
                window.location.href = '/auth/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth functions - admin only needs login
export const auth = {
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        return { data: response.data, status: response.status };
    }
};

// Admin functions
export const admin = {
    getPendingUsers: async () => {
        const response = await api.get('/admin/pending-users');
        console.log("pending users", response);
        return response.data;
    },
    approveUser: async (userId: number) => {
        const response = await api.put(`/admin/approve/${userId}`);
        return response.data;
    },
    getAllTransactions: async () => {
        const response = await api.get('/admin/transactions');
        return response.data;
    },
    getTransactionSummary: async () => {
        const response = await api.get('/admin/transactions-summary');
        return response.data;
    }
};

export default api;