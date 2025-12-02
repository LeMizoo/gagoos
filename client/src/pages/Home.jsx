import React, { useState, useEffect, useRef } from 'react';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef([]);

  const features = [
    {
      icon: '📊',
      title: 'Tableau de Bord Intelligent',
      description: 'Vue d\'ensemble complète de votre activité avec indicateurs en temps réel et analytics avancés.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: '🏭',
      title: 'Gestion de Production',
      description: 'Suivez chaque commande, gérez les étapes de production et optimisez votre workflow.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: '💰',
      title: 'Comptabilité & Finances',
      description: 'Gestion complète des finances avec suivi des dépenses, revenus et indicateurs de rentabilité.',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const testimonials = [
    {
      text: "ByGagoos a transformé notre petite entreprise familiale. Enfin un outil qui comprend nos besoins !",
      author: "Marie & Pierre",
      role: "Artisans Textile",
      avatar: "👨‍👩‍👧‍👦"
    },
    {
      text: "L'interface est intuitive et les fonctionnalités parfaitement adaptées aux artisans.",
      author: "Sophie Martin",
      role: "Créatrice de Mode",
      avatar: "👩‍🎨"
    },
    {
      text: "Un gain de temps considérable dans la gestion quotidienne de notre atelier.",
      author: "Thomas Legrand",
      role: "Sérigraphe Artisanal",
      avatar: "👨‍🏭"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
    <div className="min-h-screen">
      {/* Hero Section Épique */}
      <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 text-white overflow-hidden flex items-center justify-center">
        {/* Animation de fond */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-30 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${6 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        {/* Overlay dynamique */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <div
            ref={el => addToRefs(el, 'hero')}
            className={`transition-all duration-1000 ${visibleSections['hero'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
          >
            {/* Logo animé */}
            <div className="mb-8 transform hover:scale-110 transition-transform duration-500">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-2xl animate-pulse">
                🎨
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent animate-gradient">
              ByGagoos
            </h1>

            <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-8 rounded-full animate-pulse"></div>

            <p className="text-2xl md:text-3xl mb-8 max-w-4xl mx-auto leading-relaxed font-light">
              Imprimé avec <span className="text-yellow-300 font-bold">foi</span>,
              porté avec <span className="text-pink-300 font-bold">amour</span>.
            </p>

            <p className="text-lg md:text-xl mb-12 max-w-6xl mx-auto leading-relaxed opacity-90">
              ByGagoos est une aventure familiale et spirituelle née du désir de transmettre,
              de créer et de rassembler. À travers la sérigraphie artisanale, nous imprimons
              des messages porteurs de sens sur des textiles choisis avec soin. Chaque création
              est une offrande : simple, belle, et profondément enracinée dans nos valeurs.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href="/register"
                className="group bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl relative overflow-hidden"
              >
                <span className="relative z-10">🚀 Commencer gratuitement</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </a>

              <a
                href="/features"
                className="group border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-gray-900 transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
              >
                <span className="relative z-10">✨ Découvrir les fonctionnalités</span>
                <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </a>
            </div>

            {/* Indicateur de scroll */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notre histoire */}
      <section
        ref={el => addToRefs(el, 'story')}
        className={`py-20 bg-white transition-all duration-1000 delay-300 ${visibleSections['story'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Notre histoire
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full animate-pulse"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg text-gray-600 space-y-6">
              <p className="text-xl leading-relaxed transform hover:translate-x-2 transition-transform duration-300">
                <span className="text-3xl text-blue-500 mr-3">✨</span>
                ByGagoos est né d'un appel du cœur, d'un élan de foi et d'un amour profond pour la création.
                Fondé par Tovoniaina RAHENDRISON et sa famille, le projet s'enracine dans une vision :
                celle d'un artisanat porteur de dignité, de beauté et de spiritualité.
              </p>

              <p className="text-xl leading-relaxed transform hover:translate-x-2 transition-transform duration-300 delay-100">
                <span className="text-3xl text-red-500 mr-3">❤️</span>
                Chaque membre de la famille joue un rôle essentiel : Volatiana inspire et veille,
                Miantsatiana crée et embellit, Tia Faniry communique et relie, et Tovoniaina structure et transmet.
              </p>

              <p className="text-xl leading-relaxed transform hover:translate-x-2 transition-transform duration-300 delay-200">
                <span className="text-3xl text-green-500 mr-3">🎨</span>
                Ensemble, nous imprimons bien plus que des motifs : nous imprimons des valeurs, des liens,
                des histoires. ByGagoos est un chant silencieux, une prière en tissu, une œuvre collective
                au service du beau et du vrai.
              </p>
            </div>

            {/* Signature familiale */}
            <div className="mt-12 text-center">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 transform hover:scale-105 transition-transform duration-500">
                <p className="text-2xl font-light text-gray-700 italic mb-4">
                  "Une famille, une passion, une vision"
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  La Famille ByGagoos
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Fonctionnalités */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Fonctionnalités Principales
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto transform hover:scale-105 transition-transform duration-300">
              Découvrez notre suite complète d'outils pour gérer votre entreprise de sérigraphie
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                ref={el => addToRefs(el, `feature-${index}`)}
                className={`card bg-white/80 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transform transition-all duration-500 group ${visibleSections[`feature-${index}`] ? 'animate-fadeInUp opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="card-body p-8 text-center">
                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white text-3xl mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed transform group-hover:translate-y-1 transition-transform duration-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Témoignages */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ils Nous Font Confiance
            </h2>
          </div>

          <div className="relative h-96">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-500 transform ${index === currentSlide
                  ? 'opacity-100 translate-x-0 scale-100'
                  : 'opacity-0 translate-x-full scale-95'
                  }`}
              >
                <div className="card bg-gradient-to-br from-blue-600 to-purple-700 border-0 shadow-2xl transform hover:scale-105 transition-transform duration-500">
                  <div className="card-body p-12 text-white text-center">
                    <div className="text-6xl mb-6 transform hover:scale-110 transition-transform duration-300">
                      {testimonial.avatar}
                    </div>
                    <blockquote className="text-2xl italic mb-8 leading-relaxed">
                      "{testimonial.text}"
                    </blockquote>
                    <div>
                      <p className="font-bold text-xl">{testimonial.author}</p>
                      <p className="text-blue-200">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Indicateurs de slide */}
          <div className="flex justify-center space-x-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                  ? 'bg-blue-600 scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
                  }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section Contact Rapide */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Nous contacter</h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Prêt à transformer votre entreprise ? Contactez-nous dès aujourd'hui.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <a
              href="/contact"
              className="block bg-white text-blue-600 text-center text-xl py-6 px-8 rounded-2xl font-bold mb-8 hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl relative overflow-hidden group"
            >
              <span className="relative z-10">💌 Envoyer un message</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </a>

            <div className="text-center">
              <p className="text-white/80 mb-6">Ou contactez-nous directement :</p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-8">
                <a
                  href="https://wa.me/261344335930"
                  className="flex items-center justify-center text-green-300 hover:text-green-200 font-semibold text-lg transform hover:scale-105 transition-all duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="text-2xl mr-3">💬</span>
                  WhatsApp
                </a>
                <a
                  href="mailto:positifaid@live.fr"
                  className="flex items-center justify-center text-blue-300 hover:text-blue-200 font-semibold text-lg transform hover:scale-105 transition-all duration-300"
                >
                  <span className="text-2xl mr-3">📧</span>
                  Email
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center text-blue-200 hover:text-white font-semibold text-lg transform hover:scale-105 transition-all duration-300"
                >
                  <span className="text-2xl mr-3">📘</span>
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;