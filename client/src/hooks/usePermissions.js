import { useAuth } from '../context/AuthContext';

export const usePermissions = () => {
    const { hasPermission, user } = useAuth();

    const canAccess = (module) => {
        return hasPermission(module);
    };

    const isRole = (role) => {
        return user?.role === role;
    };

    const isAtLeastRole = (minRole) => {
        const roleHierarchy = {
            'salarie': 1,
            'contremaitre': 2,
            'gerante': 3,
            'admin': 4
        };

        const userLevel = roleHierarchy[user?.role] || 0;
        const minLevel = roleHierarchy[minRole] || 0;

        return userLevel >= minLevel;
    };

    return {
        canAccess,
        isRole,
        isAtLeastRole,
        userRole: user?.role
    };
};