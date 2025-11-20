import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import './Navigation.css';

const Navigation = () => {
    const { user, logout } = useContext(AuthContext);
    const { canAccess, isAtLeastRole } = usePermissions();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef(null);

    // Fermer le dropdown en cliquant à l'extérieur
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMobileMenuOpen(false);
        setIsDropdownOpen(false);
    };

    // Navigation pour les pages publiques
    const publicNavigation = [
        { name: 'Accueil', path: '/', icon: '🏠' },
        { name: 'Produits', path: '/products', icon: '🛍️' },
        { name: 'Galerie', path: '/gallery', icon: '🖼️' },
        { name: 'À propos', path: '/about', icon: 'ℹ️' },
        { name: 'Contact', path: '/contact', icon: '📞' }
    ];

    // Navigation pour utilisateurs connectés avec permissions
    const getUserNavigation = () => {
        const navigation = [];

        if (canAccess('dashboard')) {
            navigation.push({ name: 'Dashboard', path: '/dashboard', icon: '📊' });
        }
        if (canAccess('production')) {
            navigation.push({ name: 'Production', path: '/production', icon: '🏭' });
        }
        if (canAccess('stocks')) {
            navigation.push({ name: 'Stocks', path: '/stocks', icon: '📦' });
        }
        if (canAccess('rh') && isAtLeastRole('gerante')) {
            navigation.push({ name: 'RH', path: '/rh', icon: '👥' });
        }
        if (canAccess('comptabilité') && isAtLeastRole('gerante')) {
            navigation.push({ name: 'Comptabilité', path: '/comptabilite', icon: '💰' });
        }

        return navigation;
    };

    const userNavigation = getUserNavigation();

    const getRoleBadgeColor = (role) => {
        const colors = {
            'gerante': 'role-badge-gerante',
            'contremaitre': 'role-badge-contremaitre',
            'salarie': 'role-badge-salarie',
            'admin': 'role-badge-admin'
        };
        return colors[role] || 'role-badge-default';
    };

    const getRoleDisplayName = (role) => {
        const names = {
            'gerante': 'Gérante',
            'contremaitre': 'Contremaître',
            'salarie': 'Salarié',
            'admin': 'Administrateur'
        };
        return names[role] || role;
    };

    return (
        <>
            <nav className="main-nav">
                <div className="nav-container">
                    {/* Logo */}
                    <div className="nav-logo">
                        <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                            <img src="/images/logos/gagoos.png" alt="Gagoos" className="logo-image" />
                            <span className="logo-text">ByGagoos</span>
                        </Link>
                    </div>

                    {/* Navigation Links - Desktop */}
                    <div className={`nav-links ${isMobileMenuOpen ? 'nav-links-mobile' : ''}`}>
                        {/* Navigation Publique */}
                        {publicNavigation.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-link ${location.pathname === item.path ? 'nav-link-active' : ''
                                    }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                {item.name}
                            </Link>
                        ))}

                        {/* Dropdown Espace Pro si connecté et a des permissions */}
                        {user && userNavigation.length > 0 && (
                            <div className="dropdown-container" ref={dropdownRef}>
                                <button
                                    className={`dropdown-trigger ${userNavigation.some(item => location.pathname === item.path) ? 'dropdown-active' : ''
                                        }`}
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    aria-expanded={isDropdownOpen}
                                    aria-haspopup="true"
                                >
                                    <span className="dropdown-icon">⚙️</span>
                                    Espace Pro
                                    <span className={`dropdown-arrow ${isDropdownOpen ? 'dropdown-arrow-open' : ''}`}>
                                        ▼
                                    </span>
                                </button>

                                {isDropdownOpen && (
                                    <div className="dropdown-menu" role="menu">
                                        <div className="dropdown-header">
                                            <div className="user-badge">
                                                <div className="status-indicator connected"></div>
                                                <span>{user.prenom || user.name}</span>
                                            </div>
                                            <div className={`user-role-badge ${getRoleBadgeColor(user.role)}`}>
                                                {getRoleDisplayName(user.role)}
                                            </div>
                                        </div>

                                        <div className="dropdown-divider"></div>

                                        <div className="dropdown-links">
                                            {userNavigation.map((item) => (
                                                <Link
                                                    key={item.path}
                                                    to={item.path}
                                                    className={`dropdown-link ${location.pathname === item.path ? 'dropdown-link-active' : ''
                                                        }`}
                                                    onClick={() => {
                                                        setIsDropdownOpen(false);
                                                        setIsMobileMenuOpen(false);
                                                    }}
                                                    role="menuitem"
                                                >
                                                    <span className="dropdown-link-icon">{item.icon}</span>
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>

                                        <div className="dropdown-divider"></div>

                                        <button
                                            onClick={handleLogout}
                                            className="dropdown-logout"
                                            role="menuitem"
                                        >
                                            <span className="logout-icon">🚪</span>
                                            Déconnexion
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* User Section - Desktop (seulement si non connecté) */}
                    {!user && (
                        <div className="nav-user-section">
                            <div className="auth-buttons">
                                <Link to="/login" className="login-btn">
                                    Connexion
                                </Link>
                                <Link to="/register" className="register-btn">
                                    Inscription
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Menu mobile"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="mobile-menu-overlay"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
                        {/* Section Publique - Mobile */}
                        <div className="mobile-section">
                            <div className="section-label-mobile">Navigation</div>
                            {publicNavigation.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`mobile-nav-link ${location.pathname === item.path ? 'mobile-nav-link-active' : ''
                                        }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <span className="mobile-nav-icon">{item.icon}</span>
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* Section Utilisateur - Mobile */}
                        {user && userNavigation.length > 0 && (
                            <div className="mobile-section">
                                <div className="section-label-mobile">Espace Professionnel</div>
                                {userNavigation.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`mobile-nav-link user-mobile-nav-link ${location.pathname === item.path ? 'mobile-nav-link-active' : ''
                                            }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <span className="mobile-nav-icon">{item.icon}</span>
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* User Info & Actions - Mobile */}
                        {user ? (
                            <div className="mobile-user-section">
                                <div className="mobile-user-info">
                                    <div className="status-indicator connected"></div>
                                    <div>
                                        <div className="user-name-mobile">{user.prenom || user.name}</div>
                                        <div className={`user-role-mobile ${getRoleBadgeColor(user.role)}`}>
                                            {getRoleDisplayName(user.role)}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="mobile-logout-btn"
                                >
                                    <span className="mobile-logout-icon">🚪</span>
                                    Déconnexion
                                </button>
                            </div>
                        ) : (
                            <div className="mobile-auth-buttons">
                                <Link
                                    to="/login"
                                    className="mobile-login-btn"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Connexion
                                </Link>
                                <Link
                                    to="/register"
                                    className="mobile-register-btn"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Inscription
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Navigation;