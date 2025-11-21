import { API_ENDPOINTS, apiRequest } from '../config/api';

export const authService = {
    login: async (credentials) => {
        return apiRequest(API_ENDPOINTS.AUTH.LOGIN, {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },

    register: async (userData) => {
        return apiRequest(API_ENDPOINTS.AUTH.REGISTER, {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },

    logout: async () => {
        return apiRequest(API_ENDPOINTS.AUTH.LOGOUT, {
            method: 'POST',
        });
    },

    getProfile: async () => {
        return apiRequest(API_ENDPOINTS.AUTH.PROFILE, {
            method: 'GET',
        });
    }
};

export const userService = {
    getAll: async () => {
        return apiRequest(API_ENDPOINTS.USERS.GET_ALL);
    },

    getById: async (id) => {
        return apiRequest(`${API_ENDPOINTS.USERS.GET_BY_ID}/${id}`);
    },

    update: async (id, userData) => {
        return apiRequest(`${API_ENDPOINTS.USERS.UPDATE}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    }
};