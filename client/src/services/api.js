// SOLUTION PRODUCTION - Configuration dynamique
const getBaseUrl = () => {
  // Si nous sommes en production (Vercel)
  if (window.location.hostname === 'bygagoos.vercel.app') {
    return 'https://bygagoos-backend.onrender.com';
  }
  // Si nous sommes en développement local
  return '';
};

const BASE_URL = getBaseUrl();

console.log('🔧 Configuration API:', {
  hostname: window.location.hostname,
  baseUrl: BASE_URL
});

export const api = {
  async request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;

    console.log('🚀 Requête API vers:', url);

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `HTTP error! status: ${response.status}`
      }));
      throw new Error(error.message || 'Erreur API');
    }

    return response.json();
  },

  // Auth functions
  async login(credentials) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: credentials,
    });
  },

  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: userData,
    });
  },

  // ... autres fonctions
};