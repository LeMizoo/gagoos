// client/src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({
    children,
    requireRole = null,
    requirePermission = null,
    fallbackPath = '/login'
}) => {
    const { user, loading, isAuthenticated, hasPermission } = useAuth();
    const location = useLocation();

    // Afficher un loader pendant le chargement
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement...</p>
                </div>
            </div>
        );
    }

    // Vérifier l'authentification
    if (!isAuthenticated) {
        // Rediriger vers login avec l'URL de retour
        const redirectPath = `${fallbackPath}?redirect=${encodeURIComponent(location.pathname + location.search)}`;
        return <Navigate to={redirectPath} replace />;
    }

    // Vérifier le rôle requis
    if (requireRole && user?.role !== requireRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Vérifier la permission requise
    if (requirePermission && !hasPermission(requirePermission)) {
        return <Navigate to="/forbidden" replace />;
    }

    // Tout est bon, afficher le contenu
    return children;
};

export default ProtectedRoute;