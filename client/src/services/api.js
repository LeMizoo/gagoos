// client/src/services/api.js

// Configuration de l'URL API
const getApiBaseUrl = () => {
  // Priorité : variable d'environnement > développement local
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Défaut en développement
  if (import.meta.env.DEV) {
    return 'http://localhost:3001';
  }

  // Défaut en production (à ajuster selon votre déploiement)
  return 'https://bygagoos-backend.onrender.com';
};

const API_BASE_URL = getApiBaseUrl();

console.log('🔧 Configuration API:', {
  environment: import.meta.env.MODE,
  apiBaseUrl: API_BASE_URL,
  viteApiUrl: import.meta.env.VITE_API_URL
});

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;

    // Initialiser les services
    this.auth = {
      login: (credentials) => this.post('/api/auth/login', credentials),
      register: (userData) => this.post('/api/auth/register', userData),
      logout: () => this.post('/api/auth/logout'),
      verify: () => this.get('/api/auth/verify'),
      profile: () => this.get('/api/auth/profile'),
      refresh: (refreshToken) => this.post('/api/auth/refresh', { refreshToken }),
      changePassword: (data) => this.post('/api/auth/change-password', data)
    };

    this.stock = {
      dashboard: () => this.get('/api/stock/dashboard'),
      overview: () => this.get('/api/stock/overview'),
      categories: () => this.get('/api/stock/categories'),
      suppliers: () => this.get('/api/stock/suppliers'),
      items: () => this.get('/api/stock/items'),
      alertes: () => this.get('/api/stock/alertes'),
      movements: () => this.get('/api/stock/movements')
    };

    this.production = {
      dashboard: () => this.get('/api/production/dashboard'),
      commandes: () => this.get('/api/production/commandes'),
      etapes: () => this.get('/api/production/etapes'),
      stats: () => this.get('/api/production/stats'),
      activities: () => this.get('/api/production/activities')
    };

    this.dashboard = {
      stats: () => this.get('/api/dashboard/stats'),
      activities: () => this.get('/api/dashboard/activities'),
      metrics: () => this.get('/api/dashboard/metrics')
    };
  }

  // Récupérer les headers avec le token
  getHeaders(customHeaders = {}) {
    const token = localStorage.getItem('bygagoos_token');
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Méthode générique pour les requêtes
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const config = {
      method: options.method || 'GET',
      headers: this.getHeaders(options.headers),
      ...options
    };

    // Convertir le body en JSON si c'est un objet
    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
      config.body = JSON.stringify(config.body);
    }

    console.log('🌐 API Request:', {
      url,
      method: config.method,
      headers: config.headers,
      body: config.body ? (typeof config.body === 'string' ? JSON.parse(config.body) : config.body) : undefined
    });

    try {
      const response = await fetch(url, config);

      // Vérifier si la réponse est vide
      const contentType = response.headers.get('content-type');
      let responseData;

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      console.log('📨 API Response:', {
        status: response.status,
        ok: response.ok,
        data: responseData
      });

      if (!response.ok) {
        // Gestion des erreurs d'authentification
        if (response.status === 401) {
          localStorage.removeItem('bygagoos_token');
          localStorage.removeItem('bygagoos_user');
          localStorage.removeItem('bygagoos_refresh_token');

          // Rediriger vers la page de login
          if (window.location.pathname !== '/login') {
            window.location.href = '/login?session=expired';
          }

          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }

        if (response.status === 403) {
          throw new Error('Accès non autorisé');
        }

        const errorMessage = typeof responseData === 'object'
          ? responseData.message || responseData.error || 'Erreur inconnue'
          : 'Erreur serveur';

        throw new Error(errorMessage);
      }

      return responseData;
    } catch (error) {
      console.error('❌ API Error:', {
        endpoint,
        error: error.message,
        stack: error.stack
      });

      // Ne pas propager les erreurs de redirection
      if (error.message.includes('Session expirée')) {
        throw error;
      }

      throw new Error(error.message || 'Erreur de connexion au serveur');
    }
  }

  // Méthodes HTTP simplifiées
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, data = {}, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body: data });
  }

  put(endpoint, data = {}, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body: data });
  }

  patch(endpoint, data = {}, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', body: data });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  // Méthodes utilitaires
  health() {
    return this.get('/health');
  }

  testDb() {
    return this.get('/api/test-db');
  }
}

// Instance unique du service
const apiService = new ApiService();

export default apiService;