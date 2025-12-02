import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Composant de chargement
const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Chargement...</span>
    </div>
);

// Composant de route protégée
const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, isLoading, hasRole } = useAuth();
    const location = useLocation();

    // Pendant le chargement
    if (isLoading) {
        return <LoadingSpinner />;
    }

    // Si non authentifié, rediriger vers login
    if (!isAuthenticated) {
        console.log('🔒 Accès refusé, redirection vers login');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Si un rôle spécifique est requis
    if (requiredRole && !hasRole(requiredRole)) {
        console.log('🚫 Permissions insuffisantes pour:', requiredRole);

        // Rediriger vers dashboard si pas les permissions
        return <Navigate to="/dashboard" replace />;
    }

    // Si tout est OK, afficher le contenu
    return children;
};

export default ProtectedRoute;