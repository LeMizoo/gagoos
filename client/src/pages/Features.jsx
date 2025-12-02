import React, { useState, useEffect, useRef } from 'react';

const Features = () => {
  const [visibleSections, setVisibleSections] = useState({});
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const sectionRefs = useRef([]);

  const features = [
    {
      icon: '🏭',
      title: 'Gestion de Production',
      description: 'Suivez chaque étape de votre production artisanale avec précision et optimisez votre workflow',
      color: 'from-blue-500 to-blue-600',
      animation: 'fadeInUp',
      details: ['Planification avancée', 'Suivi en temps réel', 'Optimisation des ressources']
    },
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'Gestion RH Familiale',
      description: 'Organisez les rôles de chaque membre de votre entreprise familiale de manière harmonieuse',
      color: 'from-green-500 to-green-600',
      animation: 'fadeInUp',
      details: ['Gestion des compétences', 'Planning familial', 'Répartition des tâches']
    },
    {
      icon: '📊',
      title: 'Comptabilité Essentielle',
      description: 'Simplifiez votre comptabilité avec des outils adaptés spécifiquement aux artisans',
      color: 'from-purple-500 to-purple-600',
      animation: 'fadeInUp',
      details: ['Facturation simplifiée', 'Suivi des dépenses', 'Rapports automatiques']
    },
    {
      icon: '💰',
      title: 'Module Fiscal Complet',
      description: 'Gérez vos obligations fiscales en toute sérénité avec notre module spécialisé',
      color: 'from-yellow-500 to-yellow-600',
      animation: 'fadeInUp',
      details: ['Déclarations automatiques', 'Optimisation fiscale', 'Conformité garantie']
    },
    {
      icon: '📱',
      title: 'Application Mobile',
      description: 'Accédez à vos données et gérez votre entreprise depuis n\'importe où, à tout moment',
      color: 'from-pink-500 to-pink-600',
      animation: 'fadeInUp',
      details: ['Interface mobile optimisée', 'Notifications push', 'Synchronisation cloud']
    },
    {
      icon: '👥',
      title: 'Espace Client',
      description: 'Offrez à vos clients un espace dédié pour suivre leurs commandes en temps réel',
      color: 'from-indigo-500 to-indigo-600',
      animation: 'fadeInUp',
      details: ['Portail client personnalisé', 'Suivi des commandes', 'Communication directe']
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => ({
              ...prev,
              [entry.target.dataset.section]: true
            }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el, index) => {
    if (el && !sectionRefs.current.includes(el)) {
      el.dataset.section = index;
      sectionRefs.current.push(el);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section
        ref={el => addToRefs(el, 'hero')}
        className={`relative py-20 overflow-hidden transition-all duration-1000 ${visibleSections['hero'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent animate-gradient">
              Fonctionnalités
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed transform hover:scale-105 transition-transform duration-300">
              Découvrez tous les outils conçus spécialement pour accompagner votre entreprise
              artisanale dans son développement et sa transformation digitale.
            </p>
          </div>
        </div>

        {/* Animation de fond */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-blue-300 rounded-full opacity-20 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${4 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </section>

      {/* Grille des fonctionnalités */}
      <section
        ref={el => addToRefs(el, 'features')}
        className={`py-16 transition-all duration-1000 delay-300 ${visibleSections['features'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`card bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transform transition-all duration-500 group cursor-pointer ${visibleSections['features'] ? 'animate-fadeInUp' : 'opacity-0'
                  } ${hoveredFeature === index
                    ? 'scale-105 -translate-y-4'
                    : 'hover:scale-105 hover:-translate-y-2'
                  }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="card-body p-8 text-center relative overflow-hidden">
                  {/* Icone animée */}
                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white text-3xl mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg`}>
                    {feature.icon}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed mb-6 transform group-hover:translate-y-1 transition-transform duration-300">
                    {feature.description}
                  </p>

                  {/* Détails qui apparaissent au hover */}
                  <div className={`space-y-2 transition-all duration-500 ${hoveredFeature === index ? 'opacity-100 max-h-32' : 'opacity-0 max-h-0'
                    } overflow-hidden`}>
                    {feature.details.map((detail, detailIndex) => (
                      <div
                        key={detailIndex}
                        className="flex items-center text-sm text-gray-500 transform transition-all duration-300"
                        style={{
                          transform: `translateX(${hoveredFeature === index ? '0' : '-10px'})`,
                          transitionDelay: `${detailIndex * 100}ms`
                        }}
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        {detail}
                      </div>
                    ))}
                  </div>

                  {/* Indicateur de hover */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} transform origin-left transition-transform duration-500 ${hoveredFeature === index ? 'scale-x-100' : 'scale-x-0'
                    }`}></div>

                  {/* Effet de brillance */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Avantages */}
      <section
        ref={el => addToRefs(el, 'benefits')}
        className={`py-16 transition-all duration-1000 delay-500 ${visibleSections['benefits'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: '🚀',
                title: 'Gain de Temps',
                description: 'Automatisez vos processus et gagnez jusqu\'à 10 heures par semaine',
                stat: '+10h/semaine'
              },
              {
                icon: '💰',
                title: 'Augmentation du CA',
                description: 'Augmentez votre chiffre d\'affaires grâce à une meilleure organisation',
                stat: '+35% en moyenne'
              },
              {
                icon: '😊',
                title: 'Satisfaction Client',
                description: 'Améliorez l\'expérience client et fidélisez votre audience',
                stat: '98% de satisfaction'
              }
            ].map((benefit, index) => (
              <div
                key={index}
                className="card bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 text-center p-8"
              >
                <div className="text-5xl mb-4 transform hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 mb-4">{benefit.description}</p>
                <div className="text-2xl font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
                  {benefit.stat}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Épique */}
      <section
        ref={el => addToRefs(el, 'cta')}
        className={`py-20 transition-all duration-1000 delay-700 ${visibleSections['cta'] ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 border-0 shadow-2xl transform hover:scale-105 transition-all duration-500 relative overflow-hidden">
            {/* Effets visuels */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(25)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-ping"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.2}s`
                  }}
                />
              ))}
            </div>

            <div className="card-body p-12 text-center text-white relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 transform hover:scale-105 transition-transform duration-300">
                Prêt à transformer votre entreprise ?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
                Rejoignez des centaines d'artisans qui font déjà confiance à ByGagoos
                pour développer leur activité et préserver leur savoir-faire artisanal.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="/register"
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl animate-pulse"
                >
                  🚀 Commencer gratuitement
                </a>
                <a
                  href="/contact"
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300"
                >
                  📞 Demander une démo
                </a>
              </div>

              {/* Statistiques impressionnantes */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/20">
                {[
                  { number: '500+', label: 'Artisans Satisfaits' },
                  { number: '98%', label: 'Taux de Réussite' },
                  { number: '24/7', label: 'Support Disponible' },
                  { number: '15min', label: 'Configuration Rapide' }
                ].map((stat, index) => (
                  <div key={index} className="transform hover:scale-110 transition-transform duration-300">
                    <div className="text-2xl font-bold">{stat.number}</div>
                    <div className="text-sm opacity-80">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Témoignages */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card bg-white/80 backdrop-blur-sm border-0 shadow-xl transform hover:scale-105 transition-all duration-500">
            <div className="card-body p-8 text-center">
              <div className="text-4xl mb-4">💬</div>
              <blockquote className="text-xl text-gray-700 italic mb-6">
                "ByGagoos a révolutionné notre façon de travailler. En tant qu'artisan familial,
                nous avons enfin trouvé un outil qui comprend nos besoins spécifiques."
              </blockquote>
              <div className="font-semibold text-gray-900">- Marie & Pierre, Artisans Textile</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;