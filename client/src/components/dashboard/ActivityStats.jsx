import React from 'react';
import { TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';

const ActivityStats = () => {
  const stats = [
    {
      label: 'Activité totale',
      value: '1,234',
      change: '+12%',
      trend: 'up',
      icon: TrendingUp,
      color: 'blue'
    },
    {
      label: 'Tâches complétées',
      value: '89',
      change: '+5%',
      trend: 'up',
      icon: CheckCircle,
      color: 'green'
    },
    {
      label: 'Temps passé',
      value: '34h',
      change: '-2%',
      trend: 'down',
      icon: Clock,
      color: 'purple'
    },
    {
      label: 'Collaborateurs',
      value: '12',
      change: '+3',
      trend: 'up',
      icon: Users,
      color: 'orange'
    }
  ];

  const getColorClasses = (color, trend) => {
    const colors = {
      blue: trend === 'up' ? 'text-blue-600 bg-blue-50' : 'text-red-600 bg-red-50',
      green: trend === 'up' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50',
      purple: trend === 'up' ? 'text-purple-600 bg-purple-50' : 'text-red-600 bg-red-50',
      orange: trend === 'up' ? 'text-orange-600 bg-orange-50' : 'text-red-600 bg-red-50'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Aperçu de l'Activité</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${getColorClasses(stat.color, stat.trend)}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className={`text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Graphique simple (placeholder) */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Activité des 7 derniers jours</h3>
        <div className="flex items-end justify-between h-32">
          {[40, 60, 75, 55, 80, 65, 90].map((height, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className="w-8 bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-700"
                style={{ height: `${height}%` }}
              />
              <span className="text-xs text-gray-500 mt-2">
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][index]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityStats;