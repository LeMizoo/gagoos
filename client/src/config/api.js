// Configuration des endpoints API
const getApiBaseUrl = () => {
    // En production, utiliser l'URL complète du backend
    if (import.meta.env.PROD) {
        return 'https://bygagoos-backend.onrender.com';
    }
    // En développement, utiliser le proxy Vite (vide = même origine)
    return '';
};

export const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/api/auth/login`,
        REGISTER: `${API_BASE_URL}/api/auth/register`,
        LOGOUT: `${API_BASE_URL}/api/auth/logout`,
        PROFILE: `${API_BASE_URL}/api/auth/profile`
    },
    USERS: {
        GET_ALL: `${API_BASE_URL}/api/users`,
        GET_BY_ID: `${API_BASE_URL}/api/users`,
        UPDATE: `${API_BASE_URL}/api/users`,
        DELETE: `${API_BASE_URL}/api/users`
    },
    PROJECTS: {
        GET_ALL: `${API_BASE_URL}/api/projects`,
        CREATE: `${API_BASE_URL}/api/projects`,
        UPDATE: `${API_BASE_URL}/api/projects`,
        DELETE: `${API_BASE_URL}/api/projects`
    }
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
        const error = await response.json().catch(() => ({ message: 'Erreur API' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
};