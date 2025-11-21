import React, { createContext, useState, useContext, useEffect } from 'react';

// Configuration des URLs API
const getApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    return 'https://bygagoos-backend.onrender.com';
  }
  return '';
};

const API_BASE_URL = getApiBaseUrl();

// Permissions par rôle
const rolePermissions = {
  gerante: ['dashboard', 'production', 'stocks', 'rh', 'comptabilite', 'analytics'],
  contremaitre: ['dashboard', 'production', 'stocks', 'equipe'],
  salarie: ['dashboard', 'mes-tâches', 'progression'],
  admin: ['dashboard', 'admin', 'utilisateurs', 'system'],
};

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);

  // Fonction pour vider les données d'authentification
  const clearAuthData = () => {
    localStorage.removeItem('bygagoos_token');
    localStorage.removeItem('bygagoos_user');
    setUser(null);
    setPermissions([]);
  };

  // Fonction utilitaire pour les requêtes API
  const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('🌐 API Request:', url, options.body);

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
      const errorData = await response.json().catch(() => ({
        message: `HTTP error! status: ${response.status}`,
      }));
      throw new Error(errorData.message || errorData.error || 'Erreur API');
    }

    return response.json();
  };

  // Vérification du token
  const verifyToken = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Token invalide');
      }

      return true;
    } catch (error) {
      console.error('Token verification failed:', error);
      clearAuthData();
      return false;
    }
  };

  // Effet au chargement pour vérifier l'authentification
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('bygagoos_token');
      const userData = localStorage.getItem('bygagoos_user');

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          const isValid = await verifyToken(token);

          if (isValid) {
            setUser(parsedUser);
            setPermissions(rolePermissions[parsedUser.role] || []);
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          clearAuthData();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Fonction de connexion
  const login = async (email, password) => {
    try {
      setLoading(true);

      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      });

      if (!data.success) {
        throw new Error(data.error || 'Erreur de connexion');
      }

      localStorage.setItem('bygagoos_token', data.token);
      localStorage.setItem('bygagoos_user', JSON.stringify(data.user));

      setUser(data.user);
      setPermissions(rolePermissions[data.user.role] || []);

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la connexion',
      };
    } finally {
      setLoading(false);
    }
  };

  // Fonction d'inscription CORRIGÉE
  const register = async (userData) => {
    try {
      setLoading(true);

      console.log('📝 Données envoyées à l\'API:', userData);

      // ✅ CORRECTION: Envoyer les champs requis par le backend
      const registrationData = {
        prenom: userData.prenom || userData.username || '', // Utiliser prenom ou username
        nom: userData.nom || userData.username || '',       // Utiliser nom ou username
        email: userData.email,
        password: userData.password,
        role: userData.role || 'salarie',
        departement: userData.departement || 'Production'
      };

      // Validation des champs obligatoires
      if (!registrationData.prenom || !registrationData.nom || !registrationData.email || !registrationData.password) {
        throw new Error('Tous les champs obligatoires doivent être remplis');
      }

      const data = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: registrationData,
      });

      if (!data.success) {
        throw new Error(data.error || "Erreur lors de l'inscription");
      }

      localStorage.setItem('bygagoos_token', data.token);
      localStorage.setItem('bygagoos_user', JSON.stringify(data.user));

      setUser(data.user);
      setPermissions(rolePermissions[data.user.role] || []);

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        error: error.message || "Erreur lors de l'inscription",
      };
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      const token = localStorage.getItem('bygagoos_token');
      if (token) {
        await apiRequest('/api/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      clearAuthData();
    }
  };

  // Vérification des permissions
  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    hasPermission,
    permissions,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };