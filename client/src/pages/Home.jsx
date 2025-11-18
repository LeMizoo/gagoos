import React from 'react';

const Home = () => {
  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">ByGagoos</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Imprimé avec foi, porté avec amour.
            </p>
            <p className="text-lg md:text-xl mb-12 max-w-4xl mx-auto leading-relaxed">
              ByGagoos est une aventure familiale et spirituelle née du désir de transmettre, 
              de créer et de rassembler. À travers la sérigraphie artisanale, nous imprimons 
              des messages porteurs de sens sur des textiles choisis avec soin. Chaque création 
              est une offrande : simple, belle, et profondément enracinée dans nos valeurs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/register" className="btn btn-primary text-lg px-8 py-4">
                Commencer gratuitement
              </a>
              <a href="/features" className="btn btn-outline border-white text-white hover:bg-white hover:text-gray-900 text-lg px-8 py-4">
                Découvrir les fonctionnalités
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Notre histoire */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Notre histoire</h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg text-gray-600">
              <p className="text-lg leading-relaxed mb-6">
                ByGagoos est né d'un appel du cœur, d'un élan de foi et d'un amour profond pour la création. 
                Fondé par Tovoniaina RAHENDRISON et sa famille, le projet s'enracine dans une vision : 
                celle d'un artisanat porteur de dignité, de beauté et de spiritualité.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                Chaque membre de la famille joue un rôle essentiel : Volatiana inspire et veille, 
                Miantsatiana crée et embellit, Tia Faniry communique et relie, et Tovoniaina structure et transmet.
              </p>
              <p className="text-lg leading-relaxed">
                Ensemble, nous imprimons bien plus que des motifs : nous imprimons des valeurs, des liens, 
                des histoires. ByGagoos est un chant silencieux, une prière en tissu, une œuvre collective 
                au service du beau et du vrai.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Contact Rapide */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nous contacter</h2>
          </div>
          <div className="max-w-2xl mx-auto">
            <a href="/contact" className="btn btn-primary w-full text-center text-lg py-4 mb-8">
              Envoyer le message
            </a>
            <div className="text-center">
              <p className="text-gray-600 mb-4">Ou contactez-nous directement :</p>
              <div className="flex justify-center space-x-6">
                <a href="https://wa.me/261344335930" className="flex items-center text-green-600 hover:text-green-700">
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.18-1.24-6.169-3.495-8.424"/>
                  </svg>
                  WhatsApp
                </a>
                <a href="mailto:positifaid@live.fr" className="flex items-center text-blue-600 hover:text-blue-700">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </a>
                <a href="#" className="flex items-center text-blue-800 hover:text-blue-900">
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
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