import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Référence pour le menu burger
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Fermer le menu quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Si le menu est ouvert ET que le clic n'est pas dans le menu ET pas sur le bouton burger
      if (isMenuOpen && 
          menuRef.current && 
          !menuRef.current.contains(event.target) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    // Fermer le menu quand on appuie sur Échap
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    // Ajouter les écouteurs d'événements
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    // Nettoyer les écouteurs
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  // Fermer le menu quand on clique sur un lien
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const isActiveLink = (path) => {
    return location.pathname === path ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600';
  };

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Fonctionnalités', href: '/features' },
    { name: 'Tarifs', href: '/pricing' },
    { name: 'Galerie', href: '/gallery' },
    { name: 'Produits', href: '/products' },
    { name: 'À propos', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 transition-all duration-300">
      {/* Barre supérieure */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <a href="mailto:positifaid@live.fr" className="hover:text-blue-200 transition-colors flex items-center">
              <span className="mr-2">📧</span>
              positifaid@live.fr
            </a>
            <a href="tel:+261344335930" className="hover:text-blue-200 transition-colors flex items-center">
              <span className="mr-2">📞</span>
              +261 34 43 359 30
            </a>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <span className="flex items-center">
                <span className="mr-2">👋</span>
                Bienvenue, {user.name}
              </span>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200 transition-colors flex items-center">
                  <span className="mr-1">🔐</span>
                  Connexion
                </Link>
                <Link to="/register" className="hover:text-blue-200 transition-colors flex items-center">
                  <span className="mr-1">📝</span>
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navigation principale */}
      <nav className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo avec image */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <img 
                    src="/images/logos/gagoos.png" 
                    alt="ByGagoos Logo" 
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <span className="text-white font-bold text-lg hidden">BG</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    ByGagoos
                  </span>
                  <span className="text-xs text-gray-500 -mt-1">Créations Digitales</span>
                </div>
              </Link>
            </div>

            {/* Navigation Desktop */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-blue-50 ${isActiveLink(item.href)}`}
                  >
                    {item.name}
                  </Link>
                ))}
                {user && (
                  <>
                    <Link
                      to="/dashboard"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-blue-50 ${isActiveLink('/dashboard')}`}
                    >
                      📊 Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors duration-200 flex items-center"
                    >
                      <span className="mr-1">🚪</span>
                      Déconnexion
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Bouton Menu Mobile */}
            <div className="md:hidden flex items-center">
              <button
                ref={buttonRef}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                aria-expanded={isMenuOpen}
                aria-label="Ouvrir le menu"
              >
                <span className="sr-only">Ouvrir le menu</span>
                {/* Icone Menu Burger */}
                <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1">
                  <span className={`block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                  <span className={`block h-0.5 w-6 bg-current transition duration-300 ease-in-out ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                  <span className={`block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>

          {/* Menu Mobile */}
          <div 
            ref={menuRef}
            className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
              isMenuOpen ? 'max-h-96 opacity-100 visible' : 'max-h-0 opacity-0 invisible'
            }`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200 shadow-lg rounded-b-lg">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-3 rounded-md text-base font-medium border-l-4 transition-all duration-200 ${isActiveLink(item.href)} border-blue-600 hover:bg-blue-50 hover:border-blue-700`}
                  onClick={handleLinkClick}
                >
                  {item.name}
                </Link>
              ))}
              {user && (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 border-l-4 border-green-500 transition-all duration-200"
                    onClick={handleLinkClick}
                  >
                    📊 Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      handleLinkClick();
                    }}
                    className="w-full text-left px-3 py-3 rounded-md text-base font-medium text-red-600 hover:bg-red-50 border-l-4 border-red-500 transition-all duration-200 flex items-center"
                  >
                    <span className="mr-2">🚪</span>
                    Déconnexion
                  </button>
                </>
              )}
              {!user && (
                <div className="pt-4 pb-2 border-t border-gray-200">
                  <Link
                    to="/login"
                    className="block px-3 py-2 mb-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50 transition-colors duration-200 flex items-center"
                    onClick={handleLinkClick}
                  >
                    <span className="mr-2">🔐</span>
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 flex items-center"
                    onClick={handleLinkClick}
                  >
                    <span className="mr-2">📝</span>
                    Inscription
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;