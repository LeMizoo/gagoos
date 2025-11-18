import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'ByGagoos',
      links: [
        { name: 'Accueil', href: '/', icon: '🏠' },
        { name: 'À propos', href: '/about', icon: '👥' },
        { name: 'Fonctionnalités', href: '/features', icon: '⚡' },
        { name: 'Tarifs', href: '/pricing', icon: '💰' },
      ],
    },
    {
      title: 'Produits',
      links: [
        { name: 'Nos Créations', href: '/gallery', icon: '🖼️' },
        { name: 'Collections', href: '/products', icon: '📦' },
        { name: 'Galerie', href: '/gallery', icon: '🎨' },
        { name: 'Nouveautés', href: '/products', icon: '🆕' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Contact', href: '/contact', icon: '📞' },
        { name: 'FAQ', href: '/contact', icon: '❓' },
        { name: 'Mentions légales', href: '/about', icon: '⚖️' },
        { name: 'Confidentialité', href: '/about', icon: '🔒' },
      ],
    },
    {
      title: 'Contact',
      links: [
        { name: 'positifaid@live.fr', href: 'mailto:positifaid@live.fr', icon: '📧' },
        { name: '+261 34 43 359 30', href: 'tel:+261344335930', icon: '📞' },
        { name: 'Madagascar', href: '#', icon: '📍' },
        { name: 'Support client', href: '/contact', icon: '💬' },
      ],
    },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: '📘', href: '#' },
    { name: 'Instagram', icon: '📷', href: '#' },
    { name: 'Twitter', icon: '🐦', href: '#' },
    { name: 'LinkedIn', icon: '💼', href: '#' },
    { name: 'YouTube', icon: '📺', href: '#' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      {/* Section principale du footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section avec Logo */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6 group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 overflow-hidden">
                <img 
                  src="/images/logos/gagoos.png" 
                  alt="ByGagoos Logo" 
                  className="w-14 h-14 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <span className="text-white font-bold text-xl hidden">BG</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                  ByGagoos
                </span>
                <span className="text-sm text-blue-200 -mt-1">Excellence Digitale</span>
              </div>
            </Link>
            <p className="text-blue-100 mb-6 leading-relaxed">
              Créateur d'expériences digitales exceptionnelles. Nous transformons vos idées 
              en réalités numériques avec passion et innovation depuis Madagascar.
            </p>
            
            {/* Coordonnées dans le Footer */}
            <div className="mb-6 space-y-2">
              <div className="flex items-center text-blue-100">
                <span className="mr-3 text-lg">📧</span>
                <a href="mailto:positifaid@live.fr" className="hover:text-white transition-colors">
                  positifaid@live.fr
                </a>
              </div>
              <div className="flex items-center text-blue-100">
                <span className="mr-3 text-lg">📞</span>
                <a href="tel:+261344335930" className="hover:text-white transition-colors">
                  +261 34 43 359 30
                </a>
              </div>
            </div>

            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-blue-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                  aria-label={social.name}
                  title={social.name}
                >
                  <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="lg:col-span-1">
              <h3 className="text-lg font-semibold mb-6 text-blue-300 border-l-4 border-blue-500 pl-3">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-blue-100 hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <span className="text-sm mr-2 group-hover:scale-110 transition-transform duration-200">
                        {link.icon}
                      </span>
                      <span className="flex-1">{link.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-blue-700">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 text-blue-300 flex items-center">
                <span className="mr-2">📬</span>
                Restez Informé
              </h3>
              <p className="text-blue-100">
                Abonnez-vous à notre newsletter pour recevoir les dernières actualités et offres exclusives.
              </p>
            </div>
            <div className="flex-1 w-full lg:max-w-md">
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="flex-1 px-4 py-3 bg-blue-800 border border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-blue-300 transition-all duration-200"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center">
                  <span className="mr-2">✉️</span>
                  S'abonner
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 border-t border-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-blue-200 text-sm flex items-center">
              <span className="mr-2">©</span>
              {currentYear} ByGagoos. Tous droits réservés.
            </div>
            <div className="flex flex-wrap justify-center space-x-6 text-sm">
              <Link to="/about" className="text-blue-200 hover:text-white transition-colors duration-200 flex items-center">
                <span className="mr-1">⚖️</span>
                Mentions légales
              </Link>
              <Link to="/about" className="text-blue-200 hover:text-white transition-colors duration-200 flex items-center">
                <span className="mr-1">🔒</span>
                Confidentialité
              </Link>
              <Link to="/contact" className="text-blue-200 hover:text-white transition-colors duration-200 flex items-center">
                <span className="mr-1">📄</span>
                Conditions
              </Link>
            </div>
            <div className="flex items-center space-x-2 text-blue-200 text-sm">
              <span>🛡️</span>
              <span>Site sécurisé</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button - Retour en haut */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-2xl z-40"
        aria-label="Retour en haut"
      >
        <span className="text-lg">↑</span>
      </button>
    </footer>
  );
};

export default Footer;