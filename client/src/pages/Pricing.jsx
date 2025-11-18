import React from 'react';

const Pricing = () => {
  const plans = [
    {
      name: 'Foundation',
      price: 'Gratuit',
      description: 'Parfait pour débuter',
      popular: false,
      features: [
        'Gestion production basique',
        'Gestion RH familiale',
        'Comptabilité essentielle',
        'Interface française',
        'Support par email'
      ],
      cta: 'Commencer gratuitement',
      ctaLink: '/register'
    },
    {
      name: 'Pro',
      price: '29€',
      period: '/par mois',
      description: 'Idéal pour les artisans établis',
      popular: true,
      features: [
        'Toutes les fonctionnalités Foundation',
        'Module fiscal complet',
        'Analyses avancées',
        'Application mobile',
        'Intégration bancaire',
        'Support prioritaire'
      ],
      cta: 'Essayer gratuitement',
      ctaLink: '/register'
    },
    {
      name: 'Excellence',
      price: '59€',
      period: '/par mois',
      description: 'Pour les entreprises en croissance',
      popular: false,
      features: [
        'Toutes les fonctionnalités Pro',
        'API externe',
        'E-commerce intégré',
        'Intelligence artificielle',
        'Marketplace ByGagoos',
        'Support dédié 24/7'
      ],
      cta: 'Nous contacter',
      ctaLink: '/contact'
    }
  ];

  return (
    <div className="fade-in">
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tarifs Simples et Transparents
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choisissez l'offre qui correspond le mieux à vos besoins. Tous les plans 
              incluent l'essentiel pour gérer votre entreprise artisanale.
            </p>
          </div>

          {/* Grille des tarifs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`relative rounded-2xl ${
                  plan.popular 
                    ? 'bg-white ring-2 ring-blue-500 shadow-xl transform scale-105' 
                    : 'bg-white shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Le plus populaire
                    </span>
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && (
                      <span className="text-gray-600 ml-1">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <a 
                    href={plan.ctaLink}
                    className={`w-full block text-center py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
                      plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;