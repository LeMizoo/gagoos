import React, { useContext } from 'react';
import { Plus, Upload, Share2, Download, Settings, Users, Package, BarChart3 } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const QuickActions = () => {
  const { user } = useContext(AuthContext);

  const baseActions = [
    {
      icon: Plus,
      label: 'Nouveau Projet',
      description: 'Créer un nouveau projet',
      color: 'blue',
      onClick: () => console.log('Nouveau projet'),
      path: '/commandes'
    },
    {
      icon: Users,
      label: 'Gestion Équipe',
      description: 'Gérer les équipes de production',
      color: 'green',
      onClick: () => console.log('Équipe'),
      path: '/personnel'
    },
    {
      icon: BarChart3,
      label: 'Tableau de Bord',
      description: 'Voir les statistiques globales',
      color: 'purple',
      onClick: () => console.log('Dashboard'),
      path: '/dashboard'
    }
  ];

  // Actions pour les administrateurs
  const adminActions = [
    {
      icon: Settings,
      label: 'Paramètres Admin',
      description: 'Gérer les coûts et paramètres',
      color: 'orange',
      onClick: () => console.log('Paramètres'),
      path: '/parametres'
    }
  ];

  // Actions pour les magasiniers
  const storekeeperActions = [
    {
      icon: Package,
      label: 'Gestion Stock',
      description: 'Gérer les entrées/sorties',
      color: 'red',
      onClick: () => console.log('Stock'),
      path: '/magasinier'
    }
  ];

  // Actions communes à tous
  const commonActions = [
    {
      icon: Upload,
      label: 'Importer',
      description: 'Importer des fichiers',
      color: 'indigo',
      onClick: () => console.log('Importer')
    },
    {
      icon: Download,
      label: 'Exporter',
      description: 'Exporter les données',
      color: 'teal',
      onClick: () => console.log('Exporter')
    }
  ];

  // Construire la liste des actions selon le rôle
  let actions = [...baseActions, ...commonActions];

  if (user) {
    if (user.role === 'admin') {
      actions = [...actions, ...adminActions, ...storekeeperActions];
    } else if (user.role === 'magasinier') {
      actions = [...actions, ...storekeeperActions];
    }
  }

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200',
      green: 'bg-green-50 text-green-600 hover:bg-green-100 border-green-200',
      purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100 border-purple-200',
      orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100 border-orange-200',
      red: 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200',
      indigo: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-indigo-200',
      teal: 'bg-teal-50 text-teal-600 hover:bg-teal-100 border-teal-200',
      gray: 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200'
    };
    return colors[color] || colors.blue;
  };

  const handleActionClick = (action) => {
    if (action.path) {
      window.location.href = action.path;
    } else if (action.onClick) {
      action.onClick();
    }
  };

  return (
    <div className="quick-actions">
      <h2 className="text-xl font-semibold mb-4">Actions Rapides</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={() => handleActionClick(action)}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all hover:scale-105 ${getColorClasses(action.color)}`}
            >
              <Icon className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium text-center">{action.label}</span>
              <span className="text-xs text-gray-500 text-center mt-1">{action.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;