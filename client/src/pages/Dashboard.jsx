import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCards, setVisibleCards] = useState({});
  const cardRefs = useRef([]);

  const quickActions = [
    {
      icon: '➕',
      title: 'Nouveau Produit',
      description: 'Ajouter un nouveau produit',
      color: 'from-blue-500 to-blue-600',
      animation: 'bounceIn'
    },
    {
      icon: '📦',
      title: 'Voir Commandes',
      description: 'Gérer les commandes',
      color: 'from-green-500 to-green-600',
      animation: 'bounceIn'
    },
    {
      icon: '👥',
      title: 'Clients',
      description: 'Gérer les clients',
      color: 'from-purple-500 to-purple-600',
      animation: 'bounceIn'
    },
    {
      icon: '📊',
      title: 'Rapports',
      description: 'Voir les analyses',
      color: 'from-orange-500 to-orange-600',
      animation: 'bounceIn'
    }
  ];

  useEffect(() => {
    // Simulation du chargement des données
    const loadData = async () => {
      setIsLoading(true);

      // Animation de chargement
      await new Promise(resolve => setTimeout(resolve, 1500));

      setStats([
        {
          name: 'Produits vendus',
          value: '156',
          change: '+12%',
          changeType: 'positive',
          icon: '📈',
          color: 'from-blue-500 to-blue-600'
        },
        {
          name: 'Commandes en cours',
          value: '23',
          change: '+5%',
          changeType: 'positive',
          icon: '🔄',
          color: 'from-green-500 to-green-600'
        },
        {
          name: 'Clients satisfaits',
          value: '98%',
          change: '+2%',
          changeType: 'positive',
          icon: '⭐',
          color: 'from-yellow-500 to-yellow-600'
        },
        {
          name: 'Revenu mensuel',
          value: '4,560€',
          change: '+18%',
          changeType: 'positive',
          icon: '💰',
          color: 'from-purple-500 to-purple-600'
        }
      ]);

      setRecentActivity([
        {
          id: 1,
          action: 'Nouvelle commande',
          description: 'Commande #2456 de Jean Dupont',
          time: 'Il y a 2 min',
          icon: '🛒',
          color: 'text-blue-500'
        },
        {
          id: 2,
          action: 'Paiement reçu',
          description: 'Paiement de 89€ pour commande #2455',
          time: 'Il y a 15 min',
          icon: '💳',
          color: 'text-green-500'
        },
        {
          id: 3,
          action: 'Produit ajouté',
          description: 'Nouveau produit "Collection Printemps"',
          time: 'Il y a 1 heure',
          icon: '🎨',
          color: 'text-purple-500'
        },
        {
          id: 4,
          action: 'Avis client',
          description: 'Nouvel avis 5 étoiles de Marie Martin',
          time: 'Il y a 2 heures',
          icon: '🌟',
          color: 'text-yellow-500'
        }
      ]);

      setIsLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards(prev => ({
              ...prev,
              [entry.target.dataset.card]: true
            }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [stats, recentActivity]);

  const addToRefs = (el, index) => {
    if (el && !cardRefs.current.includes(el)) {
      el.dataset.card = index;
      cardRefs.current.push(el);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {/* Header Animé */}
      <div
        className="mb-8 transition-all duration-1000 transform hover:scale-105"
        ref={el => addToRefs(el, 'header')}
      >
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
          Tableau de Bord
        </h1>
        <p className="text-xl text-gray-600 transform hover:translate-x-2 transition-transform duration-300">
          Bienvenue, <span className="text-blue-600 font-semibold">{user?.name || user?.prenom}</span> !
          Voici un aperçu de votre activité.
        </p>

        {/* Barre de progression animée */}
        <div className="w-full h-2 bg-gray-200 rounded-full mt-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
            style={{
              width: isLoading ? '0%' : '100%',
              animation: isLoading ? 'pulse 2s infinite' : 'none'
            }}
          ></div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            ref={el => addToRefs(el, `stat-${index}`)}
            className={`card bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transform transition-all duration-500 group ${visibleCards[`stat-${index}`] ? 'animate-fadeInUp opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <div className="card-body p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-white text-xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                  {stat.icon}
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${stat.changeType === 'positive'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
                  } transform group-hover:scale-110 transition-transform duration-300`}>
                  {stat.change}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                  {stat.name}
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 transform group-hover:scale-105 transition-transform duration-300">
                  {isLoading ? (
                    <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    stat.value
                  )}
                </p>
              </div>

              {/* Effet de progression */}
              <div className="w-full h-1 bg-gray-200 rounded-full mt-4 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000 ease-out transform origin-left ${isLoading ? 'scale-x-0' : 'scale-x-100'
                    }`}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activité récente */}
        <div
          ref={el => addToRefs(el, 'activity')}
          className={`card bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transform transition-all duration-500 ${visibleCards['activity'] ? 'animate-fadeInLeft opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
        >
          <div className="card-header border-b border-gray-200 pb-4 mb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="text-3xl mr-3">📋</span>
              Activité Récente
            </h2>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={activity.id}
                  className={`flex items-start space-x-4 p-4 rounded-2xl bg-gradient-to-r from-white to-gray-50 hover:from-blue-50 hover:to-purple-50 transform hover:scale-105 transition-all duration-500 group ${visibleCards['activity'] ? 'animate-fadeInUp' : 'opacity-0'
                    }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-10 h-10 rounded-xl ${activity.color} bg-opacity-20 flex items-center justify-center text-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                  </div>
                  <div className="flex-shrink-0 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full transform group-hover:scale-110 transition-transform duration-300">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div
          ref={el => addToRefs(el, 'actions')}
          className={`card bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transform transition-all duration-500 ${visibleCards['actions'] ? 'animate-fadeInRight opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
        >
          <div className="card-header border-b border-gray-200 pb-4 mb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="text-3xl mr-3">⚡</span>
              Actions Rapides
            </h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className={`bg-gradient-to-r ${action.color} text-white p-6 rounded-2xl flex flex-col items-center justify-center transform hover:scale-105 hover:shadow-xl transition-all duration-500 group ${visibleCards['actions'] ? 'animate-bounceIn' : 'opacity-0'
                    }`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="text-3xl mb-3 transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500">
                    {action.icon}
                  </div>
                  <span className="text-sm font-semibold text-center mb-1">{action.title}</span>
                  <span className="text-xs text-white/80 text-center">{action.description}</span>

                  {/* Effet de brillance */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section Performance */}
      <div
        ref={el => addToRefs(el, 'performance')}
        className={`mt-8 card bg-gradient-to-r from-blue-600 to-purple-700 border-0 shadow-2xl transform hover:scale-105 transition-all duration-500 ${visibleCards['performance'] ? 'animate-fadeInUp opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="card-body p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Performance du Mois</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Nouvelles Commandes', value: '12', trend: '↑' },
              { label: 'Clients Actifs', value: '45', trend: '↑' },
              { label: 'Produits Vendus', value: '156', trend: '↑' },
              { label: 'Satisfaction', value: '98%', trend: '→' }
            ].map((metric, index) => (
              <div key={index} className="transform hover:scale-110 transition-transform duration-300">
                <div className="text-3xl font-bold mb-2">{metric.value}</div>
                <div className="text-sm opacity-90">{metric.label}</div>
                <div className="text-green-300 text-lg">{metric.trend}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animation de fond */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-300 rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;