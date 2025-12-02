import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Navigation.css';

const Navigation = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [ripple, setRipple] = useState(null);
    const [logoLoaded, setLogoLoaded] = useState(false);
    const [logoError, setLogoError] = useState(false);

    const dropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const navRef = useRef(null);

    // Fonctions de permissions temporaires
    const canAccess = (module) => {
        if (!user) return false;
        const permissions = {
            admin: ['dashboard', 'production', 'stocks', 'rh', 'comptabilité'],
            gerante: ['dashboard', 'production', 'stocks', 'rh', 'comptabilité'],
            contremaitre: ['dashboard', 'production', 'stocks'],
            salarie: ['dashboard', 'production']
        };
        return permissions[user.role]?.includes(module) || false;
    };

    const isAtLeastRole = (requiredRole) => {
        if (!user) return false;
        const roleHierarchy = ['salarie', 'contremaitre', 'gerante', 'admin'];
        const userLevel = roleHierarchy.indexOf(user.role);
        const requiredLevel = roleHierarchy.indexOf(requiredRole);
        return userLevel >= requiredLevel;
    };

    // Gestion du scroll
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Effet de ripple
    const createRipple = (event, color = 'rgba(99, 102, 241, 0.4)') => {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        setRipple({
            x, y, size, color,
            id: Date.now()
        });

        setTimeout(() => setRipple(null), 600);
    };

    // Fermeture automatique des menus
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }

            if (isMobileMenuOpen &&
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target) &&
                !event.target.closest('.mobile-menu-btn')) {
                setIsMobileMenuOpen(false);
            }
        };

        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                setIsMobileMenuOpen(false);
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isMobileMenuOpen]);

    // Empêcher le scroll quand le menu mobile est ouvert
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const handleLogout = () => {
        document.documentElement.style.setProperty('--logout-animation', '1');
        setTimeout(() => {
            logout();
            navigate('/');
            setIsMobileMenuOpen(false);
            setIsDropdownOpen(false);
            document.documentElement.style.setProperty('--logout-animation', '0');
        }, 800);
    };

    // Navigation pour les pages publiques
    const publicNavigation = [
        {
            name: 'Accueil',
            path: '/',
            icon: '🏠',
            title: 'Page d\'accueil',
            animation: 'bounce'
        },
        {
            name: 'Produits',
            path: '/products',
            icon: '🎨',
            title: 'Nos produits',
            animation: 'pulse'
        },
        {
            name: 'Galerie',
            path: '/gallery',
            icon: '🖼️',
            title: 'Galerie photos',
            animation: 'wiggle'
        },
        {
            name: 'À propos',
            path: '/about',
            icon: '💎',
            title: 'À propos de nous',
            animation: 'spin'
        },
        {
            name: 'Contact',
            path: '/contact',
            icon: '📱',
            title: 'Nous contacter',
            animation: 'tada'
        }
    ];

    // Navigation pour utilisateurs connectés
    const getUserNavigation = () => {
        const navigation = [];

        if (canAccess('dashboard')) {
            navigation.push({
                name: 'Dashboard',
                path: '/dashboard',
                icon: '📊',
                title: 'Tableau de bord',
                animation: 'chart'
            });
        }
        if (canAccess('production')) {
            navigation.push({
                name: 'Production',
                path: '/production',
                icon: '⚙️',
                title: 'Production',
                animation: 'gear'
            });
        }
        if (canAccess('stocks')) {
            navigation.push({
                name: 'Stocks',
                path: '/stocks',
                icon: '📦',
                title: 'Gestion des stocks',
                animation: 'box'
            });
        }
        if (canAccess('rh') && isAtLeastRole('gerante')) {
            navigation.push({
                name: 'RH',
                path: '/rh',
                icon: '👥',
                title: 'Ressources humaines',
                animation: 'people'
            });
        }
        if (canAccess('comptabilité') && isAtLeastRole('gerante')) {
            navigation.push({
                name: 'Comptabilité',
                path: '/comptabilite',
                icon: '💰',
                title: 'Comptabilité',
                animation: 'money'
            });
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
            'admin': 'Admin'
        };
        return names[role] || role;
    };

    // Composant Logo avec fallback
    const LogoComponent = ({ isMobile = false }) => {
        if (logoError || !logoLoaded) {
            return (
                <div className={`logo-fallback bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg ${isMobile ? 'w-10 h-10 text-lg' : 'w-12 h-12 text-xl'
                    }`}>
                    BG
                </div>
            );
        }

        return (
            <img
                src="../images/logos/gagoos.png"
                alt="ByGagoos"
                className={isMobile ? "mobile-logo-image" : "logo-image"}
                onLoad={() => setLogoLoaded(true)}
                onError={() => {
                    setLogoError(true);
                    console.warn('Logo non trouvé à: /images/logos/gagoos.png');
                }}
            />
        );
    };

    return (
        <>
            <nav className={`main-nav ${scrolled ? 'nav-scrolled' : ''}`} ref={navRef}>
                <div className="nav-container">
                    {/* Logo */}
                    <div className="nav-logo">
                        <Link
                            to="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="logo-link"
                        >
                            <div className="flex items-center gap-3">
                                <div className="logo-image-container relative">
                                    <LogoComponent />
                                    <div className="logo-glow"></div>
                                </div>
                                <div className="logo-content">
                                    <span className="logo-text">ByGagoos</span>
                                    <span className="logo-subtitle">Textile Madagascar</span>
                                </div>
                            </div>
                            {ripple && (
                                <span
                                    className="ripple-effect"
                                    style={{
                                        left: ripple.x,
                                        top: ripple.y,
                                        width: ripple.size,
                                        height: ripple.size,
                                        background: ripple.color
                                    }}
                                />
                            )}
                        </Link>
                    </div>

                    {/* Navigation Links - Desktop */}
                    <div className="nav-links">
                        {/* Navigation Publique */}
                        {publicNavigation.map((item, index) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-link ${location.pathname === item.path ? 'nav-link-active' : ''} ${hoveredItem === item.path ? 'nav-link-hovered' : ''}`}
                                onClick={(e) => {
                                    createRipple(e);
                                    setIsMobileMenuOpen(false);
                                }}
                                onMouseEnter={() => setHoveredItem(item.path)}
                                onMouseLeave={() => setHoveredItem(null)}
                                title={item.title}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <span className={`nav-icon icon-${item.animation}`}>{item.icon}</span>
                                <span className="nav-tooltip">{item.name}</span>
                                <span className="nav-glow"></span>
                            </Link>
                        ))}

                        {/* Dropdown Espace Pro si connecté */}
                        {user && userNavigation.length > 0 && (
                            <div className="dropdown-container" ref={dropdownRef}>
                                <button
                                    className={`dropdown-trigger with-text ${userNavigation.some(item => location.pathname.startsWith(item.path)) ? 'dropdown-active' : ''} ${isDropdownOpen ? 'dropdown-open' : ''}`}
                                    onClick={(e) => {
                                        createRipple(e);
                                        setIsDropdownOpen(!isDropdownOpen);
                                    }}
                                    onMouseEnter={(e) => createRipple(e, 'rgba(99, 102, 241, 0.3)')}
                                    aria-expanded={isDropdownOpen}
                                    aria-haspopup="true"
                                    title="Espace Professionnel"
                                >
                                    <span className="dropdown-icon icon-rocket">🚀</span>
                                    <span className="dropdown-text">Espace Pro</span>
                                    <span className="dropdown-glow"></span>
                                </button>

                                {isDropdownOpen && (
                                    <div className="dropdown-menu" role="menu">
                                        <div className="dropdown-header">
                                            <div className="user-info">
                                                <div className="user-avatar avatar-float">
                                                    {user.prenom?.charAt(0) || user.name?.charAt(0) || 'U'}
                                                </div>
                                                <div className="user-details">
                                                    <div className="user-name">{user.prenom || user.name}</div>
                                                    <div className={`user-role-badge ${getRoleBadgeColor(user.role)} badge-pop`}>
                                                        {getRoleDisplayName(user.role)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="dropdown-divider"></div>

                                        <div className="dropdown-links">
                                            {userNavigation.map((item, index) => (
                                                <Link
                                                    key={item.path}
                                                    to={item.path}
                                                    className={`dropdown-link ${location.pathname.startsWith(item.path) ? 'dropdown-link-active' : ''}`}
                                                    onClick={(e) => {
                                                        createRipple(e);
                                                        setIsDropdownOpen(false);
                                                        setIsMobileMenuOpen(false);
                                                    }}
                                                    role="menuitem"
                                                    title={item.title}
                                                    style={{ animationDelay: `${index * 0.05}s` }}
                                                >
                                                    <span className={`dropdown-link-icon icon-${item.animation}`}>{item.icon}</span>
                                                    <span className="dropdown-link-text">{item.name}</span>
                                                    <span className="dropdown-link-glow"></span>
                                                </Link>
                                            ))}
                                        </div>

                                        <div className="dropdown-divider"></div>

                                        <button
                                            onClick={(e) => {
                                                createRipple(e, 'rgba(239, 68, 68, 0.3)');
                                                handleLogout();
                                            }}
                                            className="dropdown-logout"
                                            role="menuitem"
                                            title="Déconnexion"
                                        >
                                            <span className="logout-icon icon-logout">🔓</span>
                                            <span className="logout-text">Déconnexion</span>
                                            <span className="logout-glow"></span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* User Actions - Desktop */}
                    <div className="nav-actions">
                        {user ? (
                            <div className="user-actions">
                                <div
                                    className="user-status"
                                    onMouseEnter={(e) => createRipple(e, 'rgba(16, 185, 129, 0.3)')}
                                >
                                    <div className="status-indicator connected status-pulse"></div>
                                    <span className="user-avatar-sm avatar-bounce">
                                        {user.prenom?.charAt(0) || user.name?.charAt(0) || 'U'}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="auth-actions">
                                <Link
                                    to="/login"
                                    className="auth-icon-btn login-icon-btn"
                                    onClick={(e) => createRipple(e)}
                                    onMouseEnter={(e) => createRipple(e, 'rgba(156, 163, 175, 0.3)')}
                                    title="Se connecter"
                                >
                                    <span className="auth-icon icon-key">🔑</span>
                                    <span className="auth-glow"></span>
                                </Link>
                                <Link
                                    to="/register"
                                    className="auth-icon-btn register-icon-btn"
                                    onClick={(e) => createRipple(e)}
                                    onMouseEnter={(e) => createRipple(e, 'rgba(99, 102, 241, 0.3)')}
                                    title="S'inscrire"
                                >
                                    <span className="auth-icon icon-user">👤</span>
                                    <span className="auth-glow"></span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className={`mobile-menu-btn ${isMobileMenuOpen ? 'menu-open' : ''}`}
                        onClick={(e) => {
                            createRipple(e);
                            setIsMobileMenuOpen(!isMobileMenuOpen);
                        }}
                        onMouseEnter={(e) => createRipple(e, 'rgba(99, 102, 241, 0.3)')}
                        aria-label="Menu mobile"
                        aria-expanded={isMobileMenuOpen}
                        title="Menu principal"
                    >
                        <span className="menu-line"></span>
                        <span className="menu-line"></span>
                        <span className="menu-line"></span>
                        <span className="menu-glow"></span>
                    </button>
                </div>

                {/* Ligne de progression scroll */}
                <div className="scroll-progress">
                    <div className="scroll-progress-bar"></div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="mobile-menu-overlay">
                    <div className="mobile-menu-content" ref={mobileMenuRef}>
                        {/* Header Mobile */}
                        <div className="mobile-menu-header">
                            <div className="mobile-logo">
                                <div className="mobile-logo-image-container">
                                    <LogoComponent isMobile={true} />
                                </div>
                                <div className="mobile-logo-text">
                                    <span className="mobile-logo-title">ByGagoos</span>
                                    <span className="mobile-logo-subtitle">Textile Madagascar</span>
                                </div>
                            </div>
                            <button
                                className="mobile-close-btn"
                                onClick={(e) => {
                                    createRipple(e);
                                    setIsMobileMenuOpen(false);
                                }}
                                onMouseEnter={(e) => createRipple(e, 'rgba(99, 102, 241, 0.3)')}
                                aria-label="Fermer le menu"
                                title="Fermer"
                            >
                                <span className="close-icon">×</span>
                                <span className="close-glow"></span>
                            </button>
                        </div>

                        {/* Section Utilisateur - Mobile */}
                        {user && (
                            <div className="mobile-user-card user-card-slide">
                                <div className="mobile-user-avatar avatar-pulse">
                                    {user.prenom?.charAt(0) || user.name?.charAt(0) || 'U'}
                                </div>
                                <div className="mobile-user-info">
                                    <div className="mobile-user-name">{user.prenom || user.name}</div>
                                    <div className={`mobile-user-role ${getRoleBadgeColor(user.role)} badge-bounce`}>
                                        {getRoleDisplayName(user.role)}
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        createRipple(e, 'rgba(239, 68, 68, 0.3)');
                                        handleLogout();
                                    }}
                                    className="mobile-logout-btn"
                                    title="Déconnexion"
                                >
                                    <span className="mobile-logout-icon icon-logout">🔓</span>
                                    <span className="logout-glow"></span>
                                </button>
                            </div>
                        )}

                        {/* Section Publique - Mobile */}
                        <div className="mobile-section">
                            <div className="mobile-nav-links">
                                {publicNavigation.map((item, index) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`mobile-nav-link ${location.pathname === item.path ? 'mobile-nav-link-active' : ''}`}
                                        onClick={(e) => {
                                            createRipple(e);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        title={item.title}
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <span className={`mobile-nav-icon icon-${item.animation}`}>{item.icon}</span>
                                        <span className="mobile-nav-text">{item.name}</span>
                                        <span className="mobile-nav-glow"></span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Section Professionnelle - Mobile */}
                        {user && userNavigation.length > 0 && (
                            <div className="mobile-section">
                                <div className="section-label-mobile label-slide">Espace Pro</div>
                                <div className="mobile-nav-links">
                                    {userNavigation.map((item, index) => (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`mobile-nav-link user-mobile-nav-link ${location.pathname.startsWith(item.path) ? 'mobile-nav-link-active' : ''}`}
                                            onClick={(e) => {
                                                createRipple(e);
                                                setIsMobileMenuOpen(false);
                                            }}
                                            title={item.title}
                                            style={{ animationDelay: `${index * 0.07}s` }}
                                        >
                                            <span className={`mobile-nav-icon icon-${item.animation}`}>{item.icon}</span>
                                            <span className="mobile-nav-text">{item.name}</span>
                                            <span className="mobile-nav-glow"></span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions Auth - Mobile */}
                        {!user && (
                            <div className="mobile-auth-actions auth-actions-slide">
                                <Link
                                    to="/login"
                                    className="mobile-auth-btn mobile-login-btn"
                                    onClick={(e) => {
                                        createRipple(e);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    title="Se connecter"
                                >
                                    <span className="mobile-auth-icon icon-key">🔑</span>
                                    <span className="mobile-auth-text">Connexion</span>
                                    <span className="auth-glow"></span>
                                </Link>
                                <Link
                                    to="/register"
                                    className="mobile-auth-btn mobile-register-btn"
                                    onClick={(e) => {
                                        createRipple(e);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    title="S'inscrire"
                                >
                                    <span className="mobile-auth-icon icon-user">👤</span>
                                    <span className="mobile-auth-text">Inscription</span>
                                    <span className="auth-glow"></span>
                                </Link>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="mobile-menu-footer">
                            <div className="footer-particles">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="footer-particle" style={{ animationDelay: `${i * 0.5}s` }}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Effet de confetti */}
            <div className="confetti-container"></div>
        </>
    );
};

export default Navigation;