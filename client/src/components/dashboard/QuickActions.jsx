import React from 'react';
import { Plus, Upload, Share2, Download, Settings, Users } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      icon: Plus,
      label: 'Nouveau Projet',
      description: 'Créer un nouveau projet',
      color: 'blue',
      onClick: () => console.log('Nouveau projet')
    },
    {
      icon: Upload,
      label: 'Importer',
      description: 'Importer des fichiers',
      color: 'green',
      onClick: () => console.log('Importer')
    },
    {
      icon: Share2,
      label: 'Partager',
      description: 'Partager avec l\'équipe',
      color: 'purple',
      onClick: () => console.log('Partager')
    },
    {
      icon: Download,
      label: 'Exporter',
      description: 'Exporter les données',
      color: 'orange',
      onClick: () => console.log('Exporter')
    },
    {
      icon: Users,
      label: 'Équipe',
      description: 'Gérer l\'équipe',
      color: 'red',
      onClick: () => console.log('Équipe')
    },
    {
      icon: Settings,
      label: 'Paramètres',
      description: 'Paramètres avancés',
      color: 'gray',
      onClick: () => console.log('Paramètres')
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
      green: 'bg-green-50 text-green-600 hover:bg-green-100',
      purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
      orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
      red: 'bg-red-50 text-red-600 hover:bg-red-100',
      gray: 'bg-gray-50 text-gray-600 hover:bg-gray-100'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Actions Rapides</h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${getColorClasses(action.color)}`}
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