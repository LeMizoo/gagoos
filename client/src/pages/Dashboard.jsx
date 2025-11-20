import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { name: 'Produits vendus', value: '156', change: '+12%', changeType: 'positive' },
    { name: 'Commandes en cours', value: '23', change: '+5%', changeType: 'positive' },
    { name: 'Clients satisfaits', value: '98%', change: '+2%', changeType: 'positive' },
    { name: 'Revenu mensuel', value: '4,560€', change: '+18%', changeType: 'positive' }
  ];

  const recentActivity = [
    { id: 1, action: 'Nouvelle commande', description: 'Commande #2456 de Jean Dupont', time: 'Il y a 2 min' },
    { id: 2, action: 'Paiement reçu', description: 'Paiement de 89€ pour commande #2455', time: 'Il y a 15 min' },
    { id: 3, action: 'Produit ajouté', description: 'Nouveau produit "Collection Printemps"', time: 'Il y a 1 heure' },
    { id: 4, action: 'Avis client', description: 'Nouvel avis 5 étoiles de Marie Martin', time: 'Il y a 2 heures' }
  ];

  return (
    <div className="fade-in p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
        <p className="text-gray-600 mt-2">
          Bienvenue, {user?.name || user?.prenom} ! Voici un aperçu de votre activité.
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${stat.changeType === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {stat.change}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activité récente */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">Activité Récente</h2>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                  </div>
                  <div className="flex-shrink-0 text-xs text-gray-400">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">Actions Rapides</h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 gap-4">
              <button className="btn btn-outline flex flex-col items-center justify-center p-4 h-24">
                <svg className="w-6 h-6 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm font-medium">Nouveau Produit</span>
              </button>

              <button className="btn btn-outline flex flex-col items-center justify-center p-4 h-24">
                <svg className="w-6 h-6 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-medium">Voir Commandes</span>
              </button>

              <button className="btn btn-outline flex flex-col items-center justify-center p-4 h-24">
                <svg className="w-6 h-6 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm font-medium">Clients</span>
              </button>

              <button className="btn btn-outline flex flex-col items-center justify-center p-4 h-24">
                <svg className="w-6 h-6 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-sm font-medium">Rapports</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;