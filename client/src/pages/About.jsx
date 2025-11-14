import React from 'react';

const About = () => {
  const team = [
    {
      name: 'Tovoniaina RAHENDRISON',
      role: 'Fondateur & Structure',
      description: 'Structure et transmet la vision de ByGagoos'
    },
    {
      name: 'Volatiana RANDRIANARISOA',
      role: 'Direction Générale - Inspiration & Créativité',
      description: 'Inspire et veille sur l\'âme du projet'
    },
    {
      name: 'Miantsatiana RAHENDRISON',
      role: 'Direction des Opérations - Création & Design',
      description: 'Crée et embellit chaque réalisation'
    },
    {
      name: 'Tia Faniry RAHENDRISON',
      role: 'Direction Administrative - Communication & Relations',
      description: 'Communique et relie ByGagoos au monde'
    }
  ];

  const values = [
    {
      icon: '🙏',
      title: 'Foi et Spiritualité',
      description: 'Chaque création est une offrande, imprégnée de sens et d\'intention.'
    },
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'Famille et Communauté',
      description: 'Nous croyons en la force des liens familiaux et communautaires.'
    },
    {
      icon: '🎨',
      title: 'Artisanat et Qualité',
      description: 'L\'excellence artisanale guide chacun de nos gestes et créations.'
    }
  ];

  return (
    <div className="fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">A propos</h1>
        </div>

        {/* Notre Mission */}
        <section className="mb-16">
          <div className="card">
            <div className="card-body">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Notre Mission</h2>
              <p className="text-lg text-gray-600 text-center leading-relaxed max-w-4xl mx-auto">
                ByGagoos incarne l'union de la tradition artisanale et de l'innovation numérique 
                pour accompagner les artisans dans leur développement.
              </p>
            </div>
          </div>
        </section>

        {/* Une Aventure Familiale */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Une Aventure Familiale</h2>
              <div className="prose prose-lg text-gray-600">
                <p className="mb-4 leading-relaxed">
                  ByGagoos est bien plus qu'une entreprise : c'est une aventure familiale née 
                  d'un appel du cœur, d'un élan de foi et d'un amour profond pour la création artisanale.
                </p>
                <p className="mb-4 leading-relaxed">
                  Fondé par Tovoniaina RAHENDRISON et porté par toute sa famille, le projet 
                  s'enracine dans une vision : celle d'un artisanat porteur de dignité, de beauté et de spiritualité.
                </p>
                <p className="leading-relaxed">
                  Nous croyons que chaque création artisanale raconte une histoire, transmet une émotion 
                  et contribue à préserver un savoir-faire précieux.
                </p>
              </div>
            </div>
            <div className="bg-gray-200 rounded-2xl overflow-hidden aspect-square">
              <img 
                src="/images/famille/isika.png" 
                alt="Famille ByGagoos"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Notre Vision */}
        <section className="mb-16">
          <div className="card bg-gradient-to-r from-blue-50 to-purple-50 border-0">
            <div className="card-body text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Notre Vision</h3>
              <blockquote className="text-xl text-gray-700 italic leading-relaxed max-w-3xl mx-auto">
                "Créer un écosystème où l'artisanat traditionnel rencontre l'innovation numérique, 
                où chaque artisan peut développer son entreprise tout en préservant l'âme de son métier."
              </blockquote>
            </div>
          </div>
        </section>

        {/* Notre Équipe Familiale */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Notre Équipe Familiale</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div key={index} className="card text-center">
                <div className="card-body">
                  <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4 overflow-hidden">
                    <img 
                      src={`/images/famille/Ntsika0${(index % 4) + 1}.png`} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-medium text-sm mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Nos Valeurs */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Nos Valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <div key={index} className="card text-center">
                <div className="card-body">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;