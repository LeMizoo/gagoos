import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, requiredPermission }) => {
    const { isAuthenticated, hasPermission, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Chargement...</div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
        return <Navigate to="/unauthorized" replace />
    }

    return children
}

export default ProtectedRoute