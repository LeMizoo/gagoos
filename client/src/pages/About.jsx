import React, { useState, useEffect, useRef } from 'react';

const About = () => {
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef([]);

  const team = [
    {
      name: 'Tovoniaina RAHENDRISON',
      role: 'Fondateur & Structure',
      description: 'Structure et transmet la vision de ByGagoos',
      animation: 'fadeInUp'
    },
    {
      name: 'Volatiana RANDRIANARISOA',
      role: 'Direction Générale - Inspiration & Créativité',
      description: 'Inspire et veille sur l\'âme du projet',
      animation: 'fadeInUp'
    },
    {
      name: 'Miantsatiana RAHENDRISON',
      role: 'Direction des Opérations - Création & Design',
      description: 'Crée et embellit chaque réalisation',
      animation: 'fadeInUp'
    },
    {
      name: 'Tia Faniry RAHENDRISON',
      role: 'Direction Administrative - Communication & Relations',
      description: 'Communique et relie ByGagoos au monde',
      animation: 'fadeInUp'
    }
  ];

  const values = [
    {
      icon: '🙏',
      title: 'Foi et Spiritualité',
      description: 'Chaque création est une offrande, imprégnée de sens et d\'intention.',
      animation: 'bounceIn'
    },
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'Famille et Communauté',
      description: 'Nous croyons en la force des liens familiaux et communautaires.',
      animation: 'bounceIn'
    },
    {
      icon: '🎨',
      title: 'Artisanat et Qualité',
      description: 'L\'excellence artisanale guide chacun de nos gestes et créations.',
      animation: 'bounceIn'
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section Animée */}
      <section
        ref={el => addToRefs(el, 'hero')}
        className={`relative overflow-hidden py-20 transition-all duration-1000 ${visibleSections['hero'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent animate-gradient">
              A propos
            </h1>
            <div className="w-24 h-2 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Particules flottantes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-300 rounded-full opacity-20 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </section>

      {/* Notre Mission */}
      <section
        ref={el => addToRefs(el, 'mission')}
        className={`py-16 transition-all duration-1000 delay-200 ${visibleSections['mission'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card bg-white/80 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500">
            <div className="card-body text-center p-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 animate-pulse">
                Notre Mission
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto font-light">
                ByGagoos incarne l'union de la{' '}
                <span className="text-blue-600 font-semibold animate-bounce inline-block">tradition artisanale</span>{' '}
                et de l'innovation numérique pour accompagner les artisans dans leur développement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Une Aventure Familiale */}
      <section
        ref={el => addToRefs(el, 'adventure')}
        className={`py-16 transition-all duration-1000 delay-300 ${visibleSections['adventure'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Une Aventure{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Familiale
                </span>
              </h2>

              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p className="transform hover:translate-x-2 transition-transform duration-300">
                  <span className="text-2xl mr-2">✨</span>
                  ByGagoos est bien plus qu'une entreprise : c'est une aventure familiale née
                  d'un appel du cœur, d'un élan de foi et d'un amour profond pour la création artisanale.
                </p>

                <p className="transform hover:translate-x-2 transition-transform duration-300 delay-100">
                  <span className="text-2xl mr-2">❤️</span>
                  Fondé par Tovoniaina RAHENDRISON et porté par toute sa famille, le projet
                  s'enracine dans une vision : celle d'un artisanat porteur de dignité, de beauté et de spiritualité.
                </p>

                <p className="transform hover:translate-x-2 transition-transform duration-300 delay-200">
                  <span className="text-2xl mr-2">🎨</span>
                  Nous croyons que chaque création artisanale raconte une histoire, transmet une émotion
                  et contribue à préserver un savoir-faire précieux.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-1 transform group-hover:rotate-1 transition-transform duration-500">
                <div className="bg-white rounded-2xl overflow-hidden aspect-square">
                  <img
                    src="/images/famille/isika.png"
                    alt="Famille ByGagoos"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Effet de brillance */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Vision */}
      <section
        ref={el => addToRefs(el, 'vision')}
        className={`py-16 transition-all duration-1000 delay-400 ${visibleSections['vision'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 border-0 shadow-2xl transform hover:scale-105 transition-transform duration-500">
            <div className="card-body text-center p-12 relative overflow-hidden">
              {/* Effet de particules */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(15)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-ping"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${i * 0.2}s`
                    }}
                  />
                ))}
              </div>

              <h3 className="text-3xl md:text-4xl font-bold text-white mb-8 relative z-10">
                Notre Vision
              </h3>
              <blockquote className="text-xl md:text-2xl text-white/90 italic leading-relaxed max-w-3xl mx-auto relative z-10 transform hover:scale-105 transition-transform duration-300">
                "Créer un écosystème où l'artisanat traditionnel rencontre l'innovation numérique,
                où chaque artisan peut développer son entreprise tout en préservant l'âme de son métier."
              </blockquote>

              <div className="mt-8 text-white/70 text-sm relative z-10 animate-pulse">
                🌟 Une vision partagée, une mission commune 🌟
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Équipe Familiale */}
      <section
        ref={el => addToRefs(el, 'team')}
        className={`py-16 transition-all duration-1000 delay-500 ${visibleSections['team'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
            Notre Équipe{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Familiale
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className={`card text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transform hover:-translate-y-4 transition-all duration-500 group ${visibleSections['team'] ? 'animate-fadeInUp' : 'opacity-0'
                  }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="card-body p-6">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 overflow-hidden transform group-hover:scale-110 transition-transform duration-500 shadow-lg">
                      <img
                        src={`/images/famille/Ntsika0${(index % 4) + 1}.png`}
                        alt={member.name}
                        className="w-full h-full object-cover transform group-hover:scale-125 transition-transform duration-700"
                      />
                    </div>

                    {/* Effet de halo */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500"></div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-semibold text-sm mb-3 bg-blue-50 px-3 py-1 rounded-full inline-block transform group-hover:scale-105 transition-transform duration-300">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed transform group-hover:translate-y-1 transition-transform duration-300">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section
        ref={el => addToRefs(el, 'values')}
        className={`py-16 transition-all duration-1000 delay-600 ${visibleSections['values'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
            Nos{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Valeurs
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className={`card text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 group ${visibleSections['values'] ? 'animate-bounceIn' : 'opacity-0'
                  }`}
                style={{ animationDelay: `${index * 300}ms` }}
              >
                <div className="card-body p-8">
                  <div className="text-6xl mb-6 transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed transform group-hover:translate-y-1 transition-transform duration-300">
                    {value.description}
                  </p>
                </div>

                {/* Effet de bordure animée */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm group-hover:blur-md"></div>
                <div className="absolute inset-[1px] rounded-2xl bg-white -z-10"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 border-0 shadow-2xl transform hover:scale-105 transition-transform duration-500">
            <div className="card-body p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Rejoignez Notre Aventure
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Découvrez comment ByGagoos peut transformer votre entreprise artisanale
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                  Découvrir Nos Solutions
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300">
                  Nous Contacter
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;