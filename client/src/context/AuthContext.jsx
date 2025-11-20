import React, { createContext, useState, useContext, useEffect } from 'react';

// Permissions par rôle
const rolePermissions = {
  'gerante': ['dashboard', 'production', 'stocks', 'rh', 'comptabilite', 'analytics'],
  'contremaitre': ['dashboard', 'production', 'stocks', 'equipe'],
  'salarie': ['dashboard', 'mes-tâches', 'progression'],
  'admin': ['dashboard', 'admin', 'utilisateurs', 'system']
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

  // Vérification du token
  const verifyToken = async (token) => {
    try {
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
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

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur de connexion');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Erreur de connexion');
      }

      // Stocker les données
      localStorage.setItem('bygagoos_token', data.token);
      localStorage.setItem('bygagoos_user', JSON.stringify(data.user));

      setUser(data.user);
      setPermissions(rolePermissions[data.user.role] || []);

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la connexion'
      };
    } finally {
      setLoading(false);
    }
  };

  // Fonction d'inscription
  const register = async (userData) => {
    try {
      setLoading(true);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'inscription');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Erreur lors de l\'inscription');
      }

      // Stocker les données
      localStorage.setItem('bygagoos_token', data.token);
      localStorage.setItem('bygagoos_user', JSON.stringify(data.user));

      setUser(data.user);
      setPermissions(rolePermissions[data.user.role] || []);

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de l\'inscription'
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
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
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
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };