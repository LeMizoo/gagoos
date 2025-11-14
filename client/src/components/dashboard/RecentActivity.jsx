import React from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

const RecentActivity = ({ detailed = false }) => {
  const activities = [
    {
      id: 1,
      type: 'success',
      icon: CheckCircle,
      title: 'Tâche complétée',
      description: 'Vous avez terminé "Design du dashboard"',
      time: 'Il y a 5 minutes',
      color: 'text-green-500'
    },
    {
      id: 2,
      type: 'update',
      icon: Clock,
      title: 'Mise à jour',
      description: 'Profil mis à jour avec succès',
      time: 'Il y a 2 heures',
      color: 'text-blue-500'
    },
    {
      id: 3,
      type: 'warning',
      icon: AlertCircle,
      title: 'Attention requise',
      description: 'Votre mot de passe expire bientôt',
      time: 'Il y a 1 jour',
      color: 'text-orange-500'
    },
    {
      id: 4,
      type: 'error',
      icon: XCircle,
      title: 'Échec de connexion',
      description: 'Tentative de connexion depuis un nouvel appareil',
      time: 'Il y a 2 jours',
      color: 'text-red-500'
    }
  ];

  const getActivityIcon = (activity) => {
    const Icon = activity.icon;
    return <Icon className={`h-5 w-5 ${activity.color}`} />;
  };

  if (detailed) {
    return (
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            {getActivityIcon(activity)}
            <div className="flex-1">
              <p className="font-medium text-gray-900">{activity.title}</p>
              <p className="text-sm text-gray-600">{activity.description}</p>
              <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Activité Récente</h2>
      <div className="space-y-3">
        {activities.slice(0, 3).map((activity) => (
          <div key={activity.id} className="flex items-center space-x-3">
            {getActivityIcon(activity)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
              <p className="text-xs text-gray-500 truncate">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
        Voir toute l'activité
      </button>
    </div>
  );
};

export default RecentActivity;