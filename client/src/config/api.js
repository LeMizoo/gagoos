// Configuration des endpoints API
const getApiBaseUrl = () => {
    // En développement, utiliser le backend local
    if (import.meta.env.DEV) {
        return 'http://localhost:3001';
    }
    // En production, utiliser l'URL Render
    return 'https://bygagoos-backend.onrender.com';
};

export const API_BASE_URL = getApiBaseUrl();

console.log('🔧 Config API - Base URL:', API_BASE_URL);

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/api/auth/login`,
        REGISTER: `${API_BASE_URL}/api/auth/register`,
        LOGOUT: `${API_BASE_URL}/api/auth/logout`,
        PROFILE: `${API_BASE_URL}/api/auth/profile`,
        VERIFY: `${API_BASE_URL}/api/auth/verify`
    },
    USERS: {
        GET_ALL: `${API_BASE_URL}/api/users`,
        GET_BY_ID: (id) => `${API_BASE_URL}/api/users/${id}`,
        UPDATE: (id) => `${API_BASE_URL}/api/users/${id}`,
        DELETE: (id) => `${API_BASE_URL}/api/users/${id}`
    },
    HEALTH: `${API_BASE_URL}/api/health`,
    TEST_DB: `${API_BASE_URL}/api/test-db`
};

// Fonction utilitaire pour les requêtes API
export const apiRequest = async (endpoint, options = {}) => {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    const response = await fetch(endpoint, {
        ...defaultOptions,
        ...options,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({
            message: `HTTP error! status: ${response.status}`
        }));
        throw new Error(error.message || error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
};