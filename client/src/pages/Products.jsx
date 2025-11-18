import React from 'react';

const Products = () => {
  const products = [
    {
      id: 1,
      name: 'Collection Barkoay',
      description: 'Des designs uniques inspirés de notre héritage culturel, imprimés avec passion sur des textiles de qualité supérieure.',
      price: 'À partir de 29,99€',
      image: '/images/produits/barkoay-3.png',
      features: ['Sérigraphie artisanale', 'Coton 100% biologique', 'Teintures écologiques', 'Fabriqué en France']
    },
    {
      id: 2,
      name: 'Série Fosa',
      description: 'Une collection limitée célébrant la beauté sauvage et l\'élégance naturelle, pour les esprits libres et authentiques.',
      price: 'À partir de 34,99€',
      image: '/images/divers/fosa.png',
      features: ['Édition limitée', 'Design exclusif', 'Matériaux premium', 'Numérotée et signée']
    },
    {
      id: 3,
      name: 'Gagoos Art Collection',
      description: 'Des œuvres d\'art uniques transformées en produits portables, où chaque pièce raconte une histoire particulière.',
      price: 'À partir de 49,99€',
      image: '/images/divers/gagoos-art.png',
      features: ['Œuvre originale', 'Signée par l\'artiste', 'Certificat d\'authenticité', 'Encadrement inclus']
    },
    {
      id: 4,
      name: 'Essentiels ByGagoos',
      description: 'Les basiques réinventés avec notre touche artistique, parfaits pour le quotidien comme pour les occasions spéciales.',
      price: 'À partir de 24,99€',
      image: '/images/divers/barakoay-2.png',
      features: ['Confort optimal', 'Entretien facile', 'Taille inclusive', 'Livraison express']
    }
  ];

  return (
    <div className="fade-in">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Nos Créations</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Découvrez notre collection de produits artisanaux, où chaque pièce est imprégnée 
          de sens, créée avec amour et portée avec fierté.
        </p>
      </div>

      {/* Grille des produits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
        {products.map(product => (
          <div key={product.id} className="card group hover:shadow-xl transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{product.description}</p>
                  
                  <div className="mb-4">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600 mb-2">
                        <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <span className="text-2xl font-bold text-blue-600">{product.price}</span>
                  <button className="btn btn-primary">
                    Découvrir
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Section avantages */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Livraison Rapide</h3>
            <p className="text-blue-100">Expédition sous 48h</p>
          </div>

          <div>
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Paiement Sécurisé</h3>
            <p className="text-blue-100">Transactions 100% sécurisées</p>
          </div>

          <div>
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Satisfaction Garantie</h3>
            <p className="text-blue-100">30 jours pour changer d'avis</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;