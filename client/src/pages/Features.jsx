import React from 'react';

const Features = () => {
  const features = [
    {
      icon: '🏭',
      title: 'Gestion de Production',
      description: 'Suivez chaque étape de votre production artisanale avec précision'
    },
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'Gestion RH Familiale',
      description: 'Organisez les rôles de chaque membre de votre entreprise familiale'
    },
    {
      icon: '📊',
      title: 'Comptabilité Essentielle',
      description: 'Simplifiez votre comptabilité avec des outils adaptés aux artisans'
    },
    {
      icon: '💰',
      title: 'Module Fiscal Complet',
      description: 'Gérez vos obligations fiscales en toute sérénité'
    },
    {
      icon: '📱',
      title: 'Application Mobile',
      description: 'Accédez à vos données depuis n\'importe où'
    },
    {
      icon: '👥',
      title: 'Espace Client',
      description: 'Offrez à vos clients un espace dédié pour suivre leurs commandes'
    }
  ];

  return (
    <div className="fade-in">
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          {/* En-tête */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fonctionnalités
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez tous les outils conçus spécialement pour accompagner votre entreprise 
              artisanale dans son développement.
            </p>
          </div>

          {/* Grille des fonctionnalités */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="card text-center hover:shadow-lg transition-shadow duration-300">
                <div className="card-body">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-12 text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Prêt à transformer votre entreprise ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Rejoignez des centaines d'artisans qui font confiance à ByGagoos
            </p>
            <a 
              href="/register" 
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Commencer gratuitement
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;