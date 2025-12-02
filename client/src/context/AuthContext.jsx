// client/src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';

// Permissions par rôle
const ROLE_PERMISSIONS = {
  admin: [
    'dashboard:view', 'dashboard:admin', 'users:manage', 'system:admin',
    'production:manage', 'stock:manage', 'rh:manage', 'accounting:manage',
    'analytics:view', 'settings:manage'
  ],
  gerante: [
    'dashboard:view', 'production:manage', 'stock:manage', 'rh:manage',
    'accounting:manage', 'analytics:view', 'settings:view'
  ],
  contremaitre: [
    'dashboard:view', 'production:manage', 'stock:view', 'team:manage'
  ],
  salarie: [
    'dashboard:view', 'tasks:manage', 'progress:view'
  ]
};

// Création du contexte
const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

// Provider d'authentification
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Nettoyer les données d'authentification
  const clearAuthData = useCallback(() => {
    localStorage.removeItem('bygagoos_token');
    localStorage.removeItem('bygagoos_user');
    localStorage.removeItem('bygagoos_refresh_token');
    setUser(null);
    setPermissions([]);
  }, []);

  // Initialiser les permissions
  const initializePermissions = useCallback((userRole) => {
    const userPermissions = ROLE_PERMISSIONS[userRole] || ROLE_PERMISSIONS.salarie;
    setPermissions(userPermissions);
    console.log('🔑 Permissions initialisées:', userRole, userPermissions);
  }, []);

  // Vérifier et rafraîchir le token
  const verifyAndRefreshToken = useCallback(async () => {
    const token = localStorage.getItem('bygagoos_token');
    const userData = localStorage.getItem('bygagoos_user');
    const refreshToken = localStorage.getItem('bygagoos_refresh_token');

    if (!token || !userData) {
      return false;
    }

    try {
      // D'abord essayer de vérifier le token actuel
      const verifyResponse = await api.auth.verify();

      if (verifyResponse.success && verifyResponse.user) {
        const parsedUser = verifyResponse.user;
        setUser(parsedUser);
        initializePermissions(parsedUser.role);
        return true;
      }
    } catch (verifyError) {
      console.log('⚠️  Token invalide, tentative de rafraîchissement...');

      // Si le token est invalide, essayer de le rafraîchir
      if (refreshToken) {
        try {
          const refreshResponse = await api.auth.refresh({ refreshToken });

          if (refreshResponse.success && refreshResponse.token) {
            // Mettre à jour le token
            localStorage.setItem('bygagoos_token', refreshResponse.token);

            if (refreshResponse.user) {
              localStorage.setItem('bygagoos_user', JSON.stringify(refreshResponse.user));
              setUser(refreshResponse.user);
              initializePermissions(refreshResponse.user.role);
              return true;
            }

            // Si pas de user dans la réponse, utiliser celui stocké
            const storedUser = JSON.parse(userData);
            setUser(storedUser);
            initializePermissions(storedUser.role);
            return true;
          }
        } catch (refreshError) {
          console.error('❌ Échec du rafraîchissement:', refreshError);
        }
      }
    }

    // Si tout échoue, nettoyer et retourner false
    clearAuthData();
    return false;
  }, [clearAuthData, initializePermissions]);

  // Initialiser l'authentification
  const initializeAuth = useCallback(async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('bygagoos_token');
      const userData = localStorage.getItem('bygagoos_user');

      if (token && userData) {
        const isValid = await verifyAndRefreshToken();

        if (!isValid) {
          // Utiliser les données stockées temporairement
          try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            initializePermissions(parsedUser.role);
            console.log('⚠️  Utilisation des données locales (token expiré)');
          } catch (parseError) {
            console.error('❌ Erreur parsing user data:', parseError);
            clearAuthData();
          }
        }
      }
    } catch (error) {
      console.error('❌ Erreur initialisation auth:', error);
      clearAuthData();
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  }, [verifyAndRefreshToken, clearAuthData, initializePermissions]);

  // Effet d'initialisation
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Connexion
  const login = async (email, password) => {
    try {
      setLoading(true);

      const response = await api.auth.login({ email, password });

      if (!response.success) {
        throw new Error(response.error || 'Erreur de connexion');
      }

      // Stocker les données
      localStorage.setItem('bygagoos_token', response.token);
      localStorage.setItem('bygagoos_user', JSON.stringify(response.user));

      if (response.refreshToken) {
        localStorage.setItem('bygagoos_refresh_token', response.refreshToken);
      }

      // Mettre à jour l'état
      setUser(response.user);
      initializePermissions(response.user.role);

      return {
        success: true,
        user: response.user
      };
    } catch (error) {
      console.error('❌ Erreur connexion:', error);

      return {
        success: false,
        error: error.message || 'Erreur lors de la connexion'
      };
    } finally {
      setLoading(false);
    }
  };

  // Inscription
  const register = async (userData) => {
    try {
      setLoading(true);

      const registrationData = {
        prenom: userData.prenom?.trim() || '',
        nom: userData.nom?.trim() || '',
        email: userData.email?.trim().toLowerCase() || '',
        password: userData.password || '',
        role: userData.role || 'salarie',
        departement: userData.departement || 'Production'
      };

      // Validation minimale
      if (!registrationData.prenom || !registrationData.nom ||
        !registrationData.email || !registrationData.password) {
        throw new Error('Tous les champs obligatoires doivent être remplis');
      }

      const response = await api.auth.register(registrationData);

      if (!response.success) {
        throw new Error(response.error || "Erreur lors de l'inscription");
      }

      // Stocker les données
      localStorage.setItem('bygagoos_token', response.token);
      localStorage.setItem('bygagoos_user', JSON.stringify(response.user));

      if (response.refreshToken) {
        localStorage.setItem('bygagoos_refresh_token', response.refreshToken);
      }

      // Mettre à jour l'état
      setUser(response.user);
      initializePermissions(response.user.role);

      return {
        success: true,
        user: response.user
      };
    } catch (error) {
      console.error('❌ Erreur inscription:', error);

      return {
        success: false,
        error: error.message || "Erreur lors de l'inscription"
      };
    } finally {
      setLoading(false);
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error('⚠️  Erreur logout API:', error);
    } finally {
      clearAuthData();
      // Rediriger vers la page de login
      window.location.href = '/login';
    }
  };

  // Vérifier une permission
  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  // Rafraîchir l'authentification manuellement
  const refreshAuth = async () => {
    return verifyAndRefreshToken();
  };

  // Valeur du contexte
  const contextValue = {
    // État
    user,
    loading,
    permissions,
    isInitialized,

    // Données dérivées
    isAuthenticated: !!user,
    userRole: user?.role,

    // Méthodes
    login,
    register,
    logout,
    hasPermission,
    refreshAuth,
    clearAuthData,

    // Utilitaires
    api
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Export du contexte
export { AuthContext };